/**
 * Nạp dữ liệu sản phẩm ban đầu vào MongoDB và đẩy ảnh sản phẩm lên R2.
 *
 *   npm run db:seed            chỉ thêm sản phẩm chưa có (theo `id`), không đụng
 *                              vào sản phẩm đã sửa trong trang quản trị
 *   npm run db:seed -- --force ghi đè toàn bộ sản phẩm bằng dữ liệu trong file
 *
 * Nguồn: `data/products.json`, ảnh trong `public/product-images/`. Ảnh được đưa
 * lên R2 dưới `products/<slug>/<tên file>` và đường dẫn trong dữ liệu đổi sang
 * địa chỉ công khai của R2. Chạy lại nhiều lần vẫn an toàn.
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { MongoClient } from 'mongodb';

const force = process.argv.includes('--force');
const root = process.cwd();

function env(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Thiếu biến môi trường ${name}. Chạy qua "npm run db:seed" để nạp .env.local.`);
    process.exit(1);
  }
  return value;
}

const CONTENT_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
};

const publicBase = env('R2_PUBLIC_BASE_URL').replace(/\/+$/, '');
const bucket = env('R2_BUCKET_NAME');
const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${env('R2_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env('R2_ACCESS_KEY_ID'),
    secretAccessKey: env('R2_SECRET_ACCESS_KEY'),
  },
});
const mongo = new MongoClient(env('MONGODB_URI'));

/** Đưa một ảnh trong `public/` lên R2, trả về đường dẫn công khai. */
async function uploadImage(localPath) {
  const relative = localPath.replace(/^\/product-images\//, '');
  const key = `products/${relative}`;
  const ext = path.extname(localPath).toLowerCase();
  const body = await readFile(path.join(root, 'public', localPath));
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: CONTENT_TYPES[ext] ?? 'application/octet-stream',
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  );
  return `${publicBase}/${key}`;
}

async function main() {
  const products = JSON.parse(await readFile(path.join(root, 'data', 'products.json'), 'utf8'));

  // Ảnh: chỉ đẩy ảnh cục bộ; ảnh đã là đường dẫn R2 thì giữ nguyên.
  let uploaded = 0;
  for (const product of products) {
    product.images = await Promise.all(
      product.images.map(async (image) => {
        if (!image.startsWith('/product-images/')) return image;
        uploaded += 1;
        return uploadImage(image);
      }),
    );
  }
  console.log(`Đã đẩy ${uploaded} ảnh lên R2 (bucket ${bucket}).`);

  await mongo.connect();
  const collection = mongo.db(process.env.MONGODB_DB || 'farmstay').collection('products');
  await collection.createIndexes([
    { key: { id: 1 }, unique: true },
    { key: { slug: 1 }, unique: true },
  ]);

  const result = await collection.bulkWrite(
    products.map((product) =>
      force
        ? { replaceOne: { filter: { id: product.id }, replacement: product, upsert: true } }
        : { updateOne: { filter: { id: product.id }, update: { $setOnInsert: product }, upsert: true } },
    ),
  );

  const total = await collection.countDocuments();
  console.log(
    `MongoDB: thêm mới ${result.upsertedCount}, ghi đè ${force ? result.modifiedCount : 0}, ` +
      `bỏ qua ${force ? 0 : products.length - result.upsertedCount} sản phẩm đã có. ` +
      `Hiện có ${total} sản phẩm.`,
  );
}

try {
  await main();
} catch (error) {
  console.error('Nạp dữ liệu thất bại:', error);
  process.exitCode = 1;
} finally {
  await mongo.close();
  s3.destroy();
}
