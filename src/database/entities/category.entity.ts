import { Entity, Column, OneToMany } from 'typeorm';
import { TransactionType } from '../enums/transaction-type.enum';
import { BaseEntity } from './base.entity';
import { Transaction } from './transaction.entity';

@Entity('categories')
export class Category extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @OneToMany(() => Transaction, (tx) => tx.category)
  transactions: Transaction[];
}