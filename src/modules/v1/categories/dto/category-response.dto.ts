export class CategoryResponseDto {
  id: string;
  name: string;
  type: 'income' | 'expense';
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}