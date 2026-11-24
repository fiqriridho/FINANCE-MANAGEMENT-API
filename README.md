# Finance Management - Backend API

RESTful API untuk aplikasi pengelolaan keuangan pribadi, dibangun menggunakan NestJS, TypeORM, dan MySQL (Laragon). Mengadopsi arsitektur blueprint TaskFlow.

## Tech Stack
- **Framework**: NestJS 11
- **ORM**: TypeORM
- **Database Engine**: MySQL 8.0 (Laragon)
- **Validation**: class-validator, class-transformer

## Spesifikasi API
- **Prefix Global**: `/v1`
- **Format Respons**: Terstandarisasi dengan `ApiResponseDto` (`success`, `statusCode`, `message`, `data`, `meta`).

### Endpoints
- **Kategori**:
  - `GET /v1/categories` - Mengambil daftar kategori (filter `type`, `search`)
  - `GET /v1/categories/:id` - Mengambil detail kategori
  - `POST /v1/categories` - Menambah kategori baru
  - `PATCH /v1/categories/:id` - Memperbarui kategori
  - `DELETE /v1/categories/:id` - Menghapus kategori (*soft delete*)
- **Transaksi**:
  - `GET /v1/transactions` - Mengambil riwayat transaksi (pagination, filter, sorting)
  - `GET /v1/transactions/summary` - Mengambil ringkasan keuangan (`totalIncome`, `totalExpense`, `balance`)
  - `GET /v1/transactions/:id` - Mengambil detail transaksi
  - `POST /v1/transactions` - Menambah transaksi baru
  - `PATCH /v1/transactions/:id` - Memperbarui transaksi
  - `DELETE /v1/transactions/:id` - Menghapus transaksi (*soft delete*)

## Persiapan & Menjalankan
1. Pastikan MySQL di Laragon aktif dan database `finance_management` telah dibuat.
2. Salin environment:
   ```bash
   cp .env.example .env
   ```
3. Jalankan migrasi database:
   ```bash
   npm run migration:run
   ```
4. Jalankan aplikasi dalam mode development:
   ```bash
   npm run start:dev
   ```
   API akan aktif di `http://localhost:3000/v1`.
