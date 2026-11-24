import { IsNotEmpty, IsString, IsEnum, MaxLength, IsOptional } from 'class-validator';
import { TransactionType } from '../../../../database/enums/transaction-type.enum';

export class CategoryRequestDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsEnum(TransactionType)
  type: TransactionType;
}

export class UpdateCategoryRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;
}
