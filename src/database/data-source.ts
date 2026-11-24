import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Category } from './entities/category.entity';
import { Transaction } from './entities/transaction.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: parseInt(process.env.DB_PORT ?? '3306', 10),
  username: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'finance_management',
  entities: [Category, Transaction],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  synchronize: false,
  logging: false,
});
