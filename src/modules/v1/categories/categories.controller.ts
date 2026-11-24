import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoryRequestDto, UpdateCategoryRequestDto } from './dto/category-request.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { ApiResponseDto } from '../../../utils/api-response.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async index(
    @Query('type') type?: string,
    @Query('search') search?: string,
  ): Promise<ApiResponseDto<CategoryResponseDto[]>> {
    const data = await this.categoriesService.findAll(type, search);
    return new ApiResponseDto(
      data,
      'Categories retrieved successfully',
      200,
    );
  }

  @Get(':id')
  async show(
    @Param('id') id: string,
  ): Promise<ApiResponseDto<CategoryResponseDto>> {
    const data = await this.categoriesService.findOne(id);
    return new ApiResponseDto(data, 'Category retrieved successfully', 200);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async store(
    @Body() dto: CategoryRequestDto,
  ): Promise<ApiResponseDto<CategoryResponseDto>> {
    const data = await this.categoriesService.create(dto);
    return new ApiResponseDto(
      data,
      'Category created successfully',
      201,
    );
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryRequestDto,
  ): Promise<ApiResponseDto<CategoryResponseDto>> {
    const data = await this.categoriesService.update(id, dto);
    return new ApiResponseDto(
      data,
      'Category updated successfully',
      200,
    );
  }

  @Delete(':id')
  async destroy(@Param('id') id: string): Promise<ApiResponseDto<null>> {
    await this.categoriesService.remove(id);
    return new ApiResponseDto(null, 'Category deleted successfully', 200);
  }
}
