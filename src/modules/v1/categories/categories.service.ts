import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../../database/entities/category.entity';
import { CategoryRequestDto, UpdateCategoryRequestDto } from './dto/category-request.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { toCategoryResponse } from './categories.mapper';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async findAll(
    type?: string,
    search?: string,
  ): Promise<CategoryResponseDto[]> {
    const qb = this.categoryRepo.createQueryBuilder('c');

    if (type) {
      qb.andWhere('c.type = :type', { type });
    }
    if (search) {
      qb.andWhere('c.name LIKE :search', {
        search: `%${search}%`,
      });
    }

    const categories = await qb.getMany();
    return categories.map(toCategoryResponse);
  }

  async findOne(id: string): Promise<CategoryResponseDto> {
    const category = await this.categoryRepo.findOne({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return toCategoryResponse(category);
  }

  async create(dto: CategoryRequestDto): Promise<CategoryResponseDto> {
    const category = this.categoryRepo.create(dto);
    const saved = await this.categoryRepo.save(category);
    return toCategoryResponse(saved);
  }

  async update(
    id: string,
    dto: UpdateCategoryRequestDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryRepo.findOne({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    Object.assign(category, dto);
    const saved = await this.categoryRepo.save(category);
    return toCategoryResponse(saved);
  }

  async remove(id: string): Promise<void> {
    const category = await this.categoryRepo.findOne({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    await this.categoryRepo.softDelete(id);
  }
}
