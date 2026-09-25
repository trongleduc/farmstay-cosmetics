import type { NextConfig } from 'next';

/**
 * Ảnh sản phẩm nằm trên Cloudflare R2. Chỉ cho `next/image` tải ảnh từ đúng
 * địa chỉ công khai của bucket, không mở cho mọi tên miền.
 */
const r2PublicBase = process.env.R2_PUBLIC_BASE_URL?.replace(/\/+$/, '');

/**
 * Form sản phẩm gửi kèm ảnh (tối đa 8MB mỗi ảnh, xem `lib/products.ts`) qua
 * Server Action, vốn mặc định chỉ nhận 1MB. `/admin` còn đi qua proxy, nơi
 * body bị cắt ở 10MB, nên nâng cả hai giới hạn cho đủ vài ảnh một lần.
 */
const UPLOAD_LIMIT = '40mb';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: r2PublicBase ? [new URL(`${r2PublicBase}/**`)] : [],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: UPLOAD_LIMIT,
    },
    proxyClientMaxBodySize: UPLOAD_LIMIT,
  },
};

export default nextConfig;
