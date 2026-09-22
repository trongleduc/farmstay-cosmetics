/**
 * Giá trong bảng sản phẩm gốc được niêm yết bằng USD nên website hiển thị
 * đúng đơn vị đó. Muốn đổi sang VNĐ thì sửa tập trung tại đây.
 */
const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

export function formatPrice(value: number): string {
  if (!Number.isFinite(value)) return 'Liên hệ';
  return priceFormatter.format(value);
}

/** Tách một khối văn bản nhiều dòng thành từng đoạn để dựng thẻ <p>. */
export function toParagraphs(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}
