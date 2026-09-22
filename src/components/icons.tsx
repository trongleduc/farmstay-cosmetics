import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

/** Thuộc tính chung cho nhóm icon vẽ bằng nét, để độ dày nét đồng nhất. */
const stroke = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

export function ArrowRight(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      aria-hidden="true"
      {...props}
    >
      <path d="M4 12h15" strokeLinecap="round" />
      <path d="m13 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <circle cx="11" cy="11" r="6.4" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="M6.2 3.6h3l1.4 3.5-2 1.3a12 12 0 0 0 5 5l1.3-2 3.5 1.4v3a1.8 1.8 0 0 1-2 1.8A15.6 15.6 0 0 1 4.4 5.6a1.8 1.8 0 0 1 1.8-2Z" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="m4 7.5 7.1 5a1.6 1.6 0 0 0 1.8 0l7.1-5" />
    </svg>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="M12 21s7-5.6 7-11a7 7 0 0 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

/** Lá cây — dùng cho giá trị "tự nhiên". */
export function LeafIcon(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="M20 4c0 8.8-4.4 13.2-10 13.2A5.2 5.2 0 0 1 4.8 12C4.8 7 9.6 4 20 4Z" />
      <path d="M4.5 19.5C7 15.4 10.6 12.2 15 10.4" />
    </svg>
  );
}

/** Giọt nước — dùng cho giá trị "dưỡng ẩm". */
export function DropletIcon(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="M12 3.2c3.4 3.6 5.6 6.4 5.6 9.1a5.6 5.6 0 1 1-11.2 0c0-2.7 2.2-5.5 5.6-9.1Z" />
      <path d="M9.4 13.6a2.8 2.8 0 0 0 2.2 3.4" />
    </svg>
  );
}

/** Ánh sáng lấp lánh — dùng cho giá trị "đổi mới". */
export function SparkleIcon(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="M12 3.2 13.7 9l5.8 1.7-5.8 1.7L12 18.2 10.3 12.4 4.5 10.7 10.3 9 12 3.2Z" />
      <path d="M18.6 16.2 19.4 18.6 21.8 19.4 19.4 20.2 18.6 22.6 17.8 20.2 15.4 19.4 17.8 18.6 18.6 16.2Z" />
    </svg>
  );
}

/** Khiên có dấu tích — dùng cho giá trị "an toàn". */
export function ShieldCheckIcon(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="M12 3 19 5.6v5.6c0 4.3-2.9 7.7-7 9.8-4.1-2.1-7-5.5-7-9.8V5.6L12 3Z" />
      <path d="m9.2 11.8 2 2 3.6-3.9" />
    </svg>
  );
}

/** Trái tim — dùng cho giá trị "vẻ đẹp riêng biệt". */
export function HeartIcon(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="M12 20s-7.4-4.4-7.4-9.4A4.1 4.1 0 0 1 12 7.8a4.1 4.1 0 0 1 7.4 2.8c0 5-7.4 9.4-7.4 9.4Z" />
    </svg>
  );
}

/** Nhiều lớp xếp chồng — dùng cho giá trị "đa dạng". */
export function LayersIcon(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="m12 3.4 8 4-8 4-8-4 8-4Z" />
      <path d="m4 12 8 4 8-4" />
      <path d="m4 16.4 8 4 8-4" />
    </svg>
  );
}

/** Bình thí nghiệm — dùng cho định hướng "nghiên cứu". */
export function FlaskIcon(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="M10 3.4h4" />
      <path d="M10.4 3.4v5.4L5.6 17a2.4 2.4 0 0 0 2.1 3.6h8.6a2.4 2.4 0 0 0 2.1-3.6l-4.8-8.2V3.4" />
      <path d="M8 14.4h8" />
    </svg>
  );
}

/** Quả địa cầu — dùng cho định hướng "mở rộng toàn cầu". */
export function GlobeIcon(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M3.6 12h16.8" />
      <path d="M12 3.4a13 13 0 0 1 0 17.2 13 13 0 0 1 0-17.2Z" />
    </svg>
  );
}

/** Khuôn mặt — dùng cho định hướng "chăm sóc theo làn da". */
export function FaceIcon(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="M12 3.4c4 0 6.6 2.4 6.6 6.2 0 5.2-3 11-6.6 11S5.4 14.8 5.4 9.6C5.4 5.8 8 3.4 12 3.4Z" />
      <path d="M9.4 10.2h.01M14.6 10.2h.01" />
      <path d="M10.4 14.6a2.6 2.6 0 0 0 3.2 0" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="m5 12.6 4.4 4.4L19 7.4" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6A22 22 0 0 0 14.28 3.5C12 3.5 10.5 4.9 10.5 7.5v2.4H7.8V13h2.7v8h3Z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
      {...props}
    >
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.1" cy="6.9" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TiktokIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.2 3h-2.7v12.1a2.4 2.4 0 1 1-1.9-2.35V10a5.3 5.3 0 1 0 4.6 5.25V8.9a6.3 6.3 0 0 0 3.6 1.13V7.3a3.6 3.6 0 0 1-3.6-3.6V3Z" />
    </svg>
  );
}

export function YoutubeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M21.6 7.9a2.5 2.5 0 0 0-1.76-1.77C18.25 5.7 12 5.7 12 5.7s-6.25 0-7.84.43A2.5 2.5 0 0 0 2.4 7.9 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.1 2.5 2.5 0 0 0 1.76 1.77c1.59.43 7.84.43 7.84.43s6.25 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.1ZM10.1 14.9V9.1l5 2.9-5 2.9Z" />
    </svg>
  );
}

export function StoreIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
      {...props}
    >
      <path d="M4 9h16l-1 10.2a1.5 1.5 0 0 1-1.5 1.3h-11A1.5 1.5 0 0 1 5 19.2L4 9Z" />
      <path d="M8.5 9V6.6a3.5 3.5 0 0 1 7 0V9" strokeLinecap="round" />
    </svg>
  );
}

type Icon = (props: IconProps) => React.JSX.Element;

const SOCIAL_ICONS: Record<string, Icon> = {
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  TikTok: TiktokIcon,
  YouTube: YoutubeIcon,
};

/** Lấy biểu tượng theo tên kênh; kênh bán hàng chưa có glyph riêng dùng icon cửa hàng. */
export function socialIcon(label: string) {
  return SOCIAL_ICONS[label] ?? StoreIcon;
}

/**
 * Biểu tượng cho các khối nội dung (giá trị cốt lõi, định hướng thương hiệu).
 * Khóa được khai báo cùng nội dung trong `lib/site.ts`.
 */
const FEATURE_ICONS = {
  leaf: LeafIcon,
  droplet: DropletIcon,
  sparkle: SparkleIcon,
  shield: ShieldCheckIcon,
  heart: HeartIcon,
  layers: LayersIcon,
  flask: FlaskIcon,
  globe: GlobeIcon,
  face: FaceIcon,
} satisfies Record<string, Icon>;

export type FeatureIconName = keyof typeof FEATURE_ICONS;

export function featureIcon(name: FeatureIconName) {
  return FEATURE_ICONS[name];
}
