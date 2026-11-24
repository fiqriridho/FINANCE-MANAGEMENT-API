import { Transaction } from '../../../database/entities/transaction.entity';
import { TransactionResponseDto } from './dto/transaction-response.dto';

export function toTransactionResponse(
  tx: Transaction,
): TransactionResponseDto {
  return {
    id: tx.id,
    title: tx.title,
    amount: Number(tx.amount),
    type: tx.type,
    description: tx.description,
    transactionDate: tx.transaction_date,
    categoryId: tx.category_id,
    category: tx.category
      ? {
          id: tx.category.id,
          name: tx.category.name,
          type: tx.category.type,
        }
      : undefined,
    created_at: tx.created_at,
    updated_at: tx.updated_at,
    deleted_at: tx.deleted_at ?? null,
  };
}