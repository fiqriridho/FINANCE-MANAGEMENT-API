export class TransactionResponseDto {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  description: string | null;
  transactionDate: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    type: 'income' | 'expense';
  };
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}