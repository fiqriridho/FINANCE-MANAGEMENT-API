import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsPositive,
  IsDateString,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { TransactionType } from '../../../../database/enums/transaction-type.enum';

export class TransactionRequestDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsPositive({ message: 'Amount must be greater than 0' })
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsDateString()
  transactionDate: string;

  @IsUUID()
  categoryId: string;
}

export class UpdateTransactionRequestDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsPositive({ message: 'Amount must be greater than 0' })
  amount?: number;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsDateString()
  transactionDate?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
