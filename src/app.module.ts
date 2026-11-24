import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { CategoriesModule } from './modules/v1/categories/categories.module';
import { TransactionsModule } from './modules/v1/transactions/transactions.module';

@Module({
  imports: [DatabaseModule, CategoriesModule, TransactionsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}