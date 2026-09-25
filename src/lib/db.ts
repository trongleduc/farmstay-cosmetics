import { MongoClient, type Collection } from 'mongodb';

import type { Product } from '@/lib/types';

/**
 * Kết nối MongoDB dùng chung cho toàn bộ server.
 *
 * Giữ client trên `globalThis` để khi dev server nạp lại module (HMR) không mở
 * thêm kết nối mới mỗi lần sửa code. Chỉ được import từ code chạy ở server.
 */

const globalForMongo = globalThis as typeof globalThis & {
  _farmstayMongo?: Promise<MongoClient>;
  _farmstayIndexes?: Promise<unknown>;
};

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Thiếu biến môi trường ${name} (xem .env.example).`);
  return value;
}

function client(): Promise<MongoClient> {
  globalForMongo._farmstayMongo ??= new MongoClient(env('MONGODB_URI')).connect().catch((error) => {
    // Kết nối hỏng thì bỏ cache để lần gọi sau thử lại, thay vì hỏng mãi.
    globalForMongo._farmstayMongo = undefined;
    throw error;
  });
  return globalForMongo._farmstayMongo;
}

export async function productsCollection(): Promise<Collection<Product>> {
  const db = (await client()).db(process.env.MONGODB_DB || 'farmstay');
  const collection = db.collection<Product>('products');

  // Chỉ mục duy nhất là chốt chặn cuối cùng: hai request cùng tạo sản phẩm sẽ
  // có một request lỗi thay vì lặng lẽ tạo ra id hoặc đường dẫn trùng nhau.
  globalForMongo._farmstayIndexes ??= collection
    .createIndexes([
      { key: { id: 1 }, unique: true },
      { key: { slug: 1 }, unique: true },
    ])
    .catch((error) => {
      globalForMongo._farmstayIndexes = undefined;
      throw error;
    });
  await globalForMongo._farmstayIndexes;

  return collection;
}
