/**
 * Bộ lọc của trang sản phẩm được mã hóa thẳng vào query string, nên mọi trạng
 * thái lọc đều có đường dẫn riêng (chia sẻ được, bấm lùi được, không cần JS).
 *
 * Tách riêng khỏi component để Server Component dựng đường dẫn mà không phải
 * kéo theo mã chạy ở trình duyệt.
 */

export type ProductQuery = {
  line?: string;
  category?: string;
  concern?: string;
  q?: string;
  sort?: string;
};

export const SORT_OPTIONS = [
  { value: 'default', label: 'Mặc định' },
  { value: 'price-asc', label: 'Giá tăng dần' },
  { value: 'price-desc', label: 'Giá giảm dần' },
  { value: 'name', label: 'Tên A–Z' },
] as const;

/** Dựng đường dẫn mới từ bộ lọc hiện tại, bỏ trống các tham số không dùng. */
export function buildHref(query: ProductQuery, patch: Partial<ProductQuery>): string {
  const next = { ...query, ...patch };
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(next)) {
    if (value) params.set(key, value);
  }
  const qs = params.toString();
  return qs ? `/products?${qs}` : '/products';
}

/** Có đang lọc theo danh mục nào không (không tính từ khóa và sắp xếp). */
export function hasActiveFilter(query: ProductQuery): boolean {
  return Boolean(query.line || query.category || query.concern);
}
