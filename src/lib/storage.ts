import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

/**
 * Lưu ảnh lên Cloudflare R2 (API tương thích S3).
 * Ảnh được phục vụ công khai qua `R2_PUBLIC_BASE_URL`, không đi qua server này.
 * Chỉ được import từ code chạy ở server.
 */

const globalForR2 = globalThis as typeof globalThis & { _farmstayR2?: S3Client };

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Thiếu biến môi trường ${name} (xem .env.example).`);
  return value;
}

function r2(): S3Client {
  globalForR2._farmstayR2 ??= new S3Client({
    region: 'auto',
    endpoint: `https://${env('R2_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env('R2_ACCESS_KEY_ID'),
      secretAccessKey: env('R2_SECRET_ACCESS_KEY'),
    },
  });
  return globalForR2._farmstayR2;
}

function publicBaseUrl(): string {
  return env('R2_PUBLIC_BASE_URL').replace(/\/+$/, '');
}

/** Đường dẫn công khai của một object trên R2. */
export function publicUrl(key: string): string {
  return `${publicBaseUrl()}/${key}`;
}

/** Ảnh có nằm trên R2 của chính site này không (dùng để lọc đường dẫn gửi lên từ form). */
export function isStorageUrl(url: string): boolean {
  const base = process.env.R2_PUBLIC_BASE_URL?.replace(/\/+$/, '');
  return Boolean(base) && url.startsWith(`${base}/`);
}

/**
 * Tải một file lên R2 và trả về đường dẫn công khai.
 * Tên file do server đặt và không bao giờ bị ghi đè, nên cho trình duyệt cache lâu dài.
 */
export async function uploadObject(key: string, body: Uint8Array, contentType: string): Promise<string> {
  await r2().send(
    new PutObjectCommand({
      Bucket: env('R2_BUCKET_NAME'),
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  );
  return publicUrl(key);
}
