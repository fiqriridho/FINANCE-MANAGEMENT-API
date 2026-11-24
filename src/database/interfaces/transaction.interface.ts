export interface TransactionInterface {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  description: string | null;
  transaction_date: string;
  category_id: string;
  category?: {
    id: string;
    name: string;
    type: 'income' | 'expense';
  };
}