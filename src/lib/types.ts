export type Spec = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  /** Dòng sản phẩm, ví dụ COLLAGEN. Rỗng khi nguồn dữ liệu không ghi. */
  line: string;
  /** Phân loại, ví dụ CHĂM SÓC DA. */
  category: string;
  /** Vấn đề da, ví dụ DƯỠNG ẨM. */
  concern: string;
  /** Câu mở đầu của phần mô tả. */
  intro: string;
  /** Các gạch đầu dòng công dụng. */
  benefits: string[];
  /** Đoạn mô tả dài, nếu nguồn dữ liệu có. */
  overview: string;
  specs: Spec[];
  ingredients: string;
  usage: string;
  caution: string;
  /** Giá niêm yết theo USD, đúng như bảng sản phẩm gốc. */
  price: number;
  images: string[];
  featured: boolean;
  /** Thứ tự hiển thị, số nhỏ đứng trước. */
  order: number;
  updatedAt: string;
};

export type ProductInput = Omit<Product, 'id' | 'updatedAt'>;
