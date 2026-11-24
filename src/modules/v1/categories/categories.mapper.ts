import { Category } from '../../../database/entities/category.entity';
import { CategoryResponseDto } from './dto/category-response.dto';

export function toCategoryResponse(
  category: Category,
): CategoryResponseDto {
  return {
    id: category.id,
    name: category.name,
    type: category.type,
    created_at: category.created_at,
    updated_at: category.updated_at,
    deleted_at: category.deleted_at ?? null,
  };
}