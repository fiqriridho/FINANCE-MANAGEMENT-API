import { CategoryInterface } from './category.interface';

export interface CategoryRepositoryInterface {
  findById(id: string): Promise<CategoryInterface | null>;
}