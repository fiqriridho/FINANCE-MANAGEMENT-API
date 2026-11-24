import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CategoryRepositoryInterface } from '../interfaces/category-repository.interface';
import { CategoryInterface } from '../interfaces/category.interface';

@Injectable()
export class CategoryRepository implements CategoryRepositoryInterface {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
  ) {}

  async findById(id: string): Promise<CategoryInterface | null> {
    return this.repository.findOne({ where: { id } });
  }

  getRepository(): Repository<Category> {
    return this.repository;
  }
}
