import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TransactionType } from '../enums/transaction-type.enum';
import { BaseEntity } from './base.entity';
import { Category } from './category.entity';

@Entity('transactions')
export class Transaction extends BaseEntity {
  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'date' })
  transaction_date: string;

  @Column({ type: 'varchar', length: 36 })
  category_id: string;

  @ManyToOne(() => Category, (cat) => cat.transactions)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}