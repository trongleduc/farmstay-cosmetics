import { socialIcon } from '@/components/icons';
import type { SocialLink } from '@/lib/site';

type SocialIconRowProps = {
  items: SocialLink[];
  /** `dark` dùng cho nền mực đậm ở footer. */
  tone?: 'light' | 'dark';
  className?: string;
};

/**
 * Hàng biểu tượng mạng xã hội dạng nút tròn.
 *
 * Kênh chưa điền đường dẫn trong `lib/site.ts` vẫn hiện biểu tượng nhưng ở
 * trạng thái mờ và không bấm được, nên bố cục không đổi khi bổ sung link sau này.
 */
export function SocialIconRow({ items, tone = 'light', className = '' }: SocialIconRowProps) {
  if (!items.length) return null;
  const toneClass = tone === 'dark' ? ' social-dot-dark' : '';

  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {items.map((item) => {
        const Icon = socialIcon(item.label);
        return (
          <li key={item.label}>
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer noopener"
                className={`social-dot${toneClass}`}
              >
                <Icon className="h-4 w-4" />
                <span className="sr-only">{item.label}</span>
              </a>
            ) : (
              <span
                className={`social-dot social-dot-idle${toneClass}`}
                title={`${item.label} — đang cập nhật`}
              >
                <Icon className="h-4 w-4" />
                <span className="sr-only">{item.label} — đang cập nhật</span>
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
