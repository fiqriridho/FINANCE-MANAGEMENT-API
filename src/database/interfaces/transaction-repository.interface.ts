import { TransactionInterface } from './transaction.interface';

export interface TransactionRepositoryInterface {
  findById(id: string): Promise<TransactionInterface | null>;
}