/**
 * Thông tin dùng chung cho toàn bộ website.
 * Sửa ở đây là đổi trên mọi trang — không cần tìm trong từng component.
 */

export const site = {
  brand: 'FARMSTAY',
  name: 'Farmstay Việt Nam',
  tagline: 'Smart Naturalism',
  description:
    'Farmstay là thương hiệu mỹ phẩm Hàn Quốc theo định hướng chăm sóc da lấy cảm hứng từ thiên nhiên, phát triển đa dạng dòng sản phẩm cho nhiều loại da và nhiều nhu cầu khác nhau.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://farmstay.vn',
  locale: 'vi_VN',
} as const;

export const company = {
  name: 'Công ty TNHH Very Very Good',
  taxCode: '0110991071',
  address: '43 Thâm Tâm, Yên Hoà, Cầu Giấy, Hà Nội',
  representative: 'Park YongKu',
  phone: '086.958.1212',
  phoneHref: 'tel:0869581212',
  email: 'verygood03.2025@gmail.com',
  mapsUrl: 'https://maps.app.goo.gl/yosheDen4NSmuunE7',
  /**
   * Nhúng bản đồ bằng tọa độ lấy từ chính đường dẫn Google Maps ở trên,
   * để ghim đúng vị trí thay vì chỉ tìm theo tên đường. Không cần API key.
   */
  mapsEmbedUrl: 'https://www.google.com/maps?q=21.0163753,105.7995309&hl=vi&z=17&output=embed',
} as const;

export type SocialLink = {
  label: string;
  /** Dán đường dẫn kênh chính thức vào đây. Để trống thì footer hiện dạng mờ, không phải link chết. */
  href: string;
};

export const socialLinks: SocialLink[] = [
  { label: 'Facebook', href: '' },
  { label: 'Instagram', href: '' },
  { label: 'TikTok', href: '' },
  { label: 'YouTube', href: '' },
];

/** Các kênh bán hàng (Shopee, Lazada, TikTok Shop...). Thêm vào là footer tự hiện. */
export const salesChannels: SocialLink[] = [
  { label: 'Shopee', href: '' },
  { label: 'Lazada', href: '' },
  { label: 'TikTok Shop', href: '' },
];

export const mainNav = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Giới thiệu', href: '/about' },
  { label: 'Sản phẩm', href: '/products' },
  { label: 'Liên hệ', href: '/contact' },
] as const;

/**
 * Hệ sinh thái sản phẩm theo tài liệu thương hiệu.
 * Đây là nội dung giới thiệu, không phải dữ liệu danh mục.
 */
export const brandLines = [
  {
    name: 'Tea Tree Biome',
    description: 'Định hướng chăm sóc, làm sạch và làm dịu da.',
  },
  {
    name: 'Cica Farm',
    description: 'Tập trung vào chăm sóc, làm dịu và duy trì trạng thái cân bằng của làn da.',
  },
  {
    name: 'Collagen',
    description: 'Định hướng chăm sóc da ẩm mịn và hỗ trợ vẻ ngoài căng khỏe.',
  },
  {
    name: 'Hyaluronic Acid',
    description: 'Tập trung vào nhu cầu cấp và duy trì độ ẩm cho da.',
  },
  {
    name: 'Retinol',
    description: 'Dòng sản phẩm hướng đến chăm sóc da chuyên sâu và các dấu hiệu lão hóa.',
  },
  {
    name: 'Black Snail & Peptide',
    description:
      'Kết hợp Snail và Peptide theo định hướng dưỡng ẩm, nuôi dưỡng và chăm sóc độ đàn hồi.',
  },
] as const;

/**
 * Một dòng giới thiệu ngắn cho từng phân loại, hiện ở khối "Khám phá danh mục"
 * trên trang chủ. Khóa trùng với `productCategories` trong `lib/taxonomy.ts`;
 * phân loại chưa có câu giới thiệu thì thẻ chỉ hiện số sản phẩm.
 */
export const categoryBlurbs: Record<string, string> = {
  'LÀM SẠCH / TẨY TẾ BÀO CHẾT': 'Bước làm sạch cho da thông thoáng trước khi dưỡng.',
  'CHĂM SÓC DA': 'Toner, ampoule và kem dưỡng cho quy trình hằng ngày.',
  'CHĂM SÓC MẮT': 'Chăm sóc vùng da mỏng quanh mắt.',
  'KEM CHỐNG NẮNG': 'Bảo vệ da trước tác động của ánh nắng.',
  'CHĂM SÓC TÓC': 'Bộ sưu tập dành riêng cho mái tóc khỏe đẹp.',
  'CHĂM SÓC DA TAY': 'Nuôi dưỡng làn da mịn màng, mềm mại.',
  'MẶT NẠ': 'Bước chăm sóc chuyên sâu cho da tươi sáng, rạng rỡ.',
};

/** Khóa biểu tượng, khớp với bảng icon trong `components/icons.tsx`. */
export type FeatureIcon = 'leaf' | 'droplet' | 'sparkle' | 'shield' | 'heart' | 'layers' | 'flask' | 'globe' | 'face';

/**
 * Bốn điểm nhấn hiện ngay dưới banner trang chủ.
 * Mỗi mục là một biểu tượng kèm một dòng chữ ngắn.
 */
export const bannerHighlights = [
  { icon: 'leaf', label: 'Cảm hứng từ thiên nhiên' },
  { icon: 'flask', label: 'Nghiên cứu tại Hàn Quốc' },
  { icon: 'shield', label: 'Vẻ đẹp an toàn' },
  { icon: 'layers', label: 'Đa dạng dòng sản phẩm' },
] as const satisfies readonly { icon: FeatureIcon; label: string }[];

export const coreValues = [
  {
    index: '01',
    icon: 'leaf',
    title: 'Natural — Tự nhiên',
    description:
      'Farmstay theo đuổi định hướng Naturalism, khai thác cảm hứng từ các thành phần và giá trị thiên nhiên trong phát triển sản phẩm.',
  },
  {
    index: '02',
    icon: 'layers',
    title: 'Diversity — Đa dạng',
    description:
      'Không có một sản phẩm duy nhất phù hợp với tất cả mọi người. Farmstay phát triển nhiều dòng sản phẩm để đáp ứng những loại da và nhu cầu chăm sóc khác nhau.',
  },
  {
    index: '03',
    icon: 'sparkle',
    title: 'Innovation — Đổi mới',
    description:
      'Thương hiệu liên tục nghiên cứu, thử nghiệm và phát triển sản phẩm mới nhằm đáp ứng sự thay đổi trong nhu cầu chăm sóc da.',
  },
  {
    index: '04',
    icon: 'shield',
    title: 'Safe Beauty — Vẻ đẹp an toàn',
    description:
      'Farmstay hướng tới việc tạo ra và thúc đẩy những giải pháp làm đẹp an toàn cho người tiêu dùng.',
  },
  {
    index: '05',
    icon: 'heart',
    title: 'Individual Beauty — Vẻ đẹp riêng biệt',
    description:
      'Farmstay tôn trọng sự khác biệt của mỗi người và xem đó là một phần tạo nên giá trị riêng của mỗi cá nhân.',
  },
] as const;

export const brandDirections = [
  {
    title: 'Đa dạng hóa sản phẩm',
    icon: 'layers',
    description:
      'Phát triển nhiều dòng chăm sóc da phục vụ các nhu cầu khác nhau như làm sạch, dưỡng ẩm, làm dịu, chăm sóc da có dấu hiệu lão hóa và chăm sóc chuyên sâu.',
  },
  {
    title: 'Phát triển theo nhu cầu làn da',
    icon: 'face',
    description:
      'Thay vì áp dụng một công thức cho tất cả, thương hiệu hướng đến những giải pháp riêng cho từng loại da và vấn đề da.',
  },
  {
    title: 'Kết hợp thiên nhiên và nghiên cứu hiện đại',
    icon: 'flask',
    description:
      'Tiếp tục phát triển các sản phẩm lấy cảm hứng từ thiên nhiên nhưng được định hướng theo nhu cầu chăm sóc da hiện đại.',
  },
  {
    title: 'Mở rộng giá trị K-Beauty',
    icon: 'globe',
    description:
      'Farmstay cung cấp nhiều dòng sản phẩm cho thị trường ngoài Hàn Quốc, đưa sản phẩm chăm sóc da Hàn Quốc đến gần hơn với người tiêu dùng toàn cầu.',
  },
] as const;
