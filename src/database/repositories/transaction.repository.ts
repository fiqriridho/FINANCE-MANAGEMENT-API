import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { TransactionRepositoryInterface } from '../interfaces/transaction-repository.interface';
import { TransactionInterface } from '../interfaces/transaction.interface';

@Injectable()
export class TransactionRepository implements TransactionRepositoryInterface {
  constructor(
    @InjectRepository(Transaction)
    private readonly repository: Repository<Transaction>,
  ) {}

  async findById(id: string): Promise<TransactionInterface | null> {
    const tx = await this.repository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!tx) return null;
    return {
      id: tx.id,
      title: tx.title,
      amount: Number(tx.amount),
      type: tx.type,
      description: tx.description,
      transaction_date: tx.transaction_date,
      category_id: tx.category_id,
      category: tx.category
        ? {
            id: tx.category.id,
            name: tx.category.name,
            type: tx.category.type,
          }
        : undefined,
    };
  }

  getRepository(): Repository<Transaction> {
    return this.repository;
  }
}
