import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './data-source';
import { Category } from './entities/category.entity';
import { Transaction } from './entities/transaction.entity';
import { CategoryRepository } from './repositories/category.repository';
import { TransactionRepository } from './repositories/transaction.repository';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST ?? '127.0.0.1',
      port: parseInt(process.env.DB_PORT ?? '3306', 10),
      username: process.env.DB_USER ?? 'root',
      password: process.env.DB_PASSWORD ?? '',
      database: process.env.DB_NAME ?? 'finance_management',
      entities: [Category, Transaction],
      migrations: [`${__dirname}/migrations/*.{ts,js}`],
      synchronize: false,
      logging: false,
    }),
    TypeOrmModule.forFeature([Category, Transaction]),
  ],
  providers: [CategoryRepository, TransactionRepository],
  exports: [TypeOrmModule, CategoryRepository, TransactionRepository],
})
export class DatabaseModule {}
