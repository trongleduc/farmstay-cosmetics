/**
 * Danh mục cố định của thương hiệu.
 *
 * Trang sản phẩm luôn hiện đủ các mục dưới đây, kể cả khi chưa có sản phẩm nào
 * thuộc mục đó — thêm sản phẩm mới là số đếm tự cập nhật. Khu quản trị cũng lấy
 * chính danh sách này làm gợi ý nhập liệu, nên tên gọi luôn thống nhất.
 *
 * Thêm hoặc sửa một mục thì chỉ cần sửa ở đây.
 */

export const productLines = [
  'TEA TREE BIOME',
  'CICA FARM',
  'COLLAGEN',
  'HYALURONIC ACID',
  'CITRUS YUJA',
  'CALENDULA',
  'PEPTIDE9',
  'CERAMIDE',
  'ESCARGOT',
] as const;

export const productCategories = [
  'LÀM SẠCH / TẨY TẾ BÀO CHẾT',
  'CHĂM SÓC DA',
  'CHĂM SÓC MẮT',
  'KEM CHỐNG NẮNG',
  'CHĂM SÓC TÓC',
  'CHĂM SÓC DA TAY',
  'MẶT NẠ',
] as const;

export const productConcerns = [
  'DA NHẠY CẢM',
  'DƯỠNG ẨM',
  'SỢI BÃ NHỜN',
  'LÀM SÁNG',
  'CHỐNG LÃO HÓA',
  'CHỐNG NẮNG',
] as const;

/** Ba trục phân loại, trùng tên với ba trường tương ứng của sản phẩm. */
export type TaxonomyKey = 'line' | 'category' | 'concern';

/** `short` là nhãn dùng cho nút lọc trên màn hình hẹp, nơi không đủ chỗ cho nhãn đầy đủ. */
export const taxonomyGroups = [
  { key: 'line', label: 'Dòng sản phẩm', short: 'Dòng', values: productLines },
  { key: 'category', label: 'Phân loại', short: 'Loại', values: productCategories },
  { key: 'concern', label: 'Vấn đề da', short: 'Vấn đề', values: productConcerns },
] as const satisfies readonly {
  key: TaxonomyKey;
  label: string;
  short: string;
  values: readonly string[];
}[];
