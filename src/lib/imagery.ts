/**
 * Ảnh dùng cho phần biên tập của trang (hero, dải ảnh lớn, khối giới thiệu).
 * Lấy từ chính bộ ảnh sản phẩm nên không phụ thuộc kho ảnh bên ngoài.
 * Đổi ảnh chỉ cần thay đường dẫn ở đây.
 */

const base = '/product-images';

export const editorial = {
  /**
   * Banner lớn đầu trang chủ. Ảnh nền là khung cảnh sáng, nhiều khoảng trống ở
   * nửa trái để phần chữ đặt lên vẫn đọc rõ.
   */
  banner: {
    src: `/banner.png`,
    alt: 'Bộ kem dưỡng da tay Farmstay Eau de Parfum đặt trên nền vải sáng',
  },
  /** Bộ kem dưỡng tay đặt trên nền vải sáng — tông trắng, hợp làm ảnh hero. */
  hero: {
    src: `${base}/eau-de-parfum-hand-cream/eau-de-parfum-hand-cream-02.jpg`,
    alt: 'Bộ kem dưỡng da tay Farmstay Eau de Parfum đặt trên nền vải sáng',
  },
  /** Ảnh phụ chồng lên hero. */
  heroAccent: {
    src: `${base}/gold-collagen-nourishing-ampoule/gold-collagen-nourishing-ampoule-01.jpg`,
    alt: 'Tinh chất Farmstay Gold Collagen Nourishing Ampoule',
  },
  /** Khối giới thiệu thương hiệu trên trang chủ. */
  brand: {
    src: `${base}/real-bamboo-essence-mask/real-bamboo-essence-mask-03.jpg`,
    alt: 'Mặt nạ tinh chất Farmstay Real Bamboo trong quy trình chăm sóc da',
  },
  /** Dải ảnh tối giữa trang, dùng cho câu chuyện thương hiệu. */
  storyBand: {
    src: `${base}/black-snail-peptide-9-perfect-emulsion-120ml/black-snail-peptide-9-perfect-emulsion-120ml-03.jpg`,
    alt: 'Dòng Farmstay Black Snail & Peptide 9 trong bối cảnh phòng nghiên cứu',
  },
  /** Ảnh cho trang giới thiệu. */
  aboutPortrait: {
    src: `${base}/eau-de-parfum-hand-cream/eau-de-parfum-hand-cream-03.jpg`,
    alt: 'Các tuýp kem dưỡng tay Farmstay Eau de Parfum',
  },
  aboutDetail: {
    src: `${base}/collagen-hyaluronic-acid-all-in-one-ampoule-250ml/collagen-hyaluronic-acid-all-in-one-ampoule-250ml-03.jpg`,
    alt: 'Farmstay Collagen & Hyaluronic Acid All-in-One Ampoule trên nền đá cẩm thạch',
  },
  aboutWide: {
    src: `${base}/real-bamboo-essence-mask/real-bamboo-essence-mask-02.jpg`,
    alt: 'Chiết xuất tre trong dòng mặt nạ Farmstay Real Bamboo',
  },
  /** Ảnh cho trang liên hệ. */
  contact: {
    src: `${base}/citrus-yuja-vitalizing-moisture-cream/citrus-yuja-vitalizing-moisture-cream-04.jpg`,
    alt: 'Dòng Farmstay Citrus Yuja',
  },
} as const;
