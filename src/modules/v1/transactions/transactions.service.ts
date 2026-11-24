import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../../../database/entities/transaction.entity';
import { Category } from '../../../database/entities/category.entity';
import {
  TransactionRequestDto,
  UpdateTransactionRequestDto,
} from './dto/transaction-request.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { toTransactionResponse } from './transactions.mapper';
import {
  PaginationMeta,
  calculatePagination,
} from '../../../utils/pagination.util';

interface ListTransactionsQuery {
  page?: number;
  limit?: number;
  search?: string;
  type?: 'income' | 'expense';
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

interface Summary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

const ALLOWED_SORT_COLUMNS: Record<string, string> = {
  id: 'id',
  title: 'title',
  amount: 'amount',
  type: 'type',
  transactionDate: 'transaction_date',
  transaction_date: 'transaction_date',
  created_at: 'created_at',
  updated_at: 'updated_at',
};

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly txRepo: Repository<Transaction>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async findAll(
    query: ListTransactionsQuery,
  ): Promise<{ data: TransactionResponseDto[]; meta: PaginationMeta }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const qb = this.txRepo.createQueryBuilder('t').leftJoinAndSelect(
      't.category',
      'c',
    );

    if (query.search) {
      qb.andWhere('t.title LIKE :search', {
        search: `%${query.search}%`,
      });
    }
    if (query.type) {
      qb.andWhere('t.type = :type', { type: query.type });
    }
    if (query.categoryId) {
      qb.andWhere('t.category_id = :categoryId', {
        categoryId: query.categoryId,
      });
    }
    if (query.startDate) {
      qb.andWhere('t.transaction_date >= :startDate', {
        startDate: query.startDate,
      });
    }
    if (query.endDate) {
      qb.andWhere('t.transaction_date <= :endDate', {
        endDate: query.endDate,
      });
    }

    const sortColumn = ALLOWED_SORT_COLUMNS[query.sortBy ?? ''] ?? 'created_at';
    const sortOrder = query.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    qb.orderBy(`t.${sortColumn}`, sortOrder);

    const total = await qb.getCount();
    const pagination = calculatePagination(total, page, limit);

    qb.skip(pagination.skip).take(pagination.limit);

    const items = await qb.getMany();

    return {
      data: items.map(toTransactionResponse),
      meta: pagination.meta,
    };
  }

  async findOne(id: string): Promise<TransactionResponseDto> {
    const tx = await this.txRepo.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!tx) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }
    return toTransactionResponse(tx);
  }

  async create(dto: TransactionRequestDto): Promise<TransactionResponseDto> {
    const category = await this.categoryRepo.findOne({
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    if (category.type !== dto.type) {
      throw new BadRequestException(
        'Transaction type must match category type',
      );
    }
    if (!dto.amount || dto.amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    const tx = this.txRepo.create({
      title: dto.title,
      amount: dto.amount,
      type: dto.type,
      description: dto.description ?? null,
      transaction_date: dto.transactionDate,
      category_id: dto.categoryId,
    });
    const saved = await this.txRepo.save(tx);
    return this.findOne(saved.id);
  }

  async update(
    id: string,
    dto: UpdateTransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    const tx = await this.txRepo.findOne({
      where: { id },
    });
    if (!tx) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }

    if (dto.amount !== undefined && dto.amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    const targetCategoryId = dto.categoryId ?? tx.category_id;
    const targetType = dto.type ?? tx.type;

    if (dto.categoryId || dto.type) {
      const category = await this.categoryRepo.findOne({
        where: { id: targetCategoryId },
      });
      if (!category) {
        throw new BadRequestException('Category not found');
      }
      if (category.type !== targetType) {
        throw new BadRequestException(
          'Transaction type must match category type',
        );
      }
    }

    if (dto.title !== undefined) tx.title = dto.title;
    if (dto.amount !== undefined) tx.amount = dto.amount;
    if (dto.type !== undefined) tx.type = dto.type;
    if (dto.description !== undefined) tx.description = dto.description;
    if (dto.transactionDate !== undefined) tx.transaction_date = dto.transactionDate;
    if (dto.categoryId !== undefined) tx.category_id = dto.categoryId;

    const saved = await this.txRepo.save(tx);
    return this.findOne(saved.id);
  }

  async remove(id: string): Promise<void> {
    const tx = await this.txRepo.findOne({
      where: { id },
    });
    if (!tx) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }
    await this.txRepo.softDelete(id);
  }

  async summary(): Promise<Summary> {
    const result = await this.txRepo
      .createQueryBuilder('t')
      .select(
        `COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0)`,
        'totalIncome',
      )
      .addSelect(
        `COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0)`,
        'totalExpense',
      )
      .getRawOne();

    const totalIncome = Number(parseFloat(result?.totalIncome ?? '0').toFixed(2));
    const totalExpense = Number(parseFloat(result?.totalExpense ?? '0').toFixed(2));
    const balance = Number((totalIncome - totalExpense).toFixed(2));

    return {
      totalIncome,
      totalExpense,
      balance,
    };
  }
}
