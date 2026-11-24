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
import { TransactionsService } from './transactions.service';
import {
  TransactionRequestDto,
  UpdateTransactionRequestDto,
} from './dto/transaction-request.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { ApiResponseDto } from '../../../utils/api-response.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('summary')
  async summary(): Promise<ApiResponseDto<any>> {
    const data = await this.transactionsService.summary();
    return new ApiResponseDto(
      data,
      'Financial summary retrieved successfully',
      200,
    );
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async index(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('type') type?: 'income' | 'expense',
    @Query('categoryId') categoryId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ): Promise<ApiResponseDto<TransactionResponseDto[]>> {
    const result = await this.transactionsService.findAll({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search,
      type,
      categoryId,
      startDate,
      endDate,
      sortBy,
      sortOrder,
    });
    return new ApiResponseDto(
      result.data,
      'Transactions retrieved successfully',
      200,
      result.meta,
    );
  }

  @Get(':id')
  async show(@Param('id') id: string): Promise<ApiResponseDto<TransactionResponseDto>> {
    const data = await this.transactionsService.findOne(id);
    return new ApiResponseDto(data, 'Transaction retrieved successfully', 200);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async store(
    @Body() dto: TransactionRequestDto,
  ): Promise<ApiResponseDto<TransactionResponseDto>> {
    const data = await this.transactionsService.create(dto);
    return new ApiResponseDto(
      data,
      'Transaction created successfully',
      201,
    );
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTransactionRequestDto,
  ): Promise<ApiResponseDto<TransactionResponseDto>> {
    const data = await this.transactionsService.update(id, dto);
    return new ApiResponseDto(
      data,
      'Transaction updated successfully',
      200,
    );
  }

  @Delete(':id')
  async destroy(@Param('id') id: string): Promise<ApiResponseDto<null>> {
    await this.transactionsService.remove(id);
    return new ApiResponseDto(null, 'Transaction deleted successfully', 200);
  }
}
