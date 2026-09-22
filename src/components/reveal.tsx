'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ElementType, ReactNode } from 'react';

type RevealVariant = 'up' | 'fade' | 'left' | 'right';

type RevealProps = {
  children: ReactNode;
  /** Thẻ HTML được dựng ra, mặc định là div. */
  as?: ElementType;
  variant?: RevealVariant;
  /** Độ trễ tính bằng mili giây, dùng để xếp lớp nhiều phần tử. */
  delay?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Hiện nội dung khi cuộn tới.
 *
 * Phần tử chỉ chuyển trạng thái một lần rồi ngắt observer, nên sau khi đã hiện
 * thì không có tương tác nào — kể cả click, focus hay cuộn ngược — làm nó ẩn đi.
 * Khi người dùng tắt hiệu ứng chuyển động, nội dung hiện ngay lập tức.
 */
export function Reveal({
  children,
  as,
  variant = 'up',
  delay = 0,
  className,
  style,
}: RevealProps) {
  const Tag = (as ?? 'div') as ElementType;
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || visible) return;

    // Trình duyệt quá cũ không có IntersectionObserver thì hiện thẳng nội dung.
    // Trường hợp người dùng tắt hiệu ứng chuyển động đã được CSS xử lý.
    if (typeof IntersectionObserver === 'undefined') {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    // Phần tử đã nằm trong khung nhìn ngay từ đầu thì hiện luôn, không chờ cuộn.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <Tag
      ref={ref}
      data-reveal={variant}
      data-reveal-state={visible ? 'in' : 'out'}
      className={className}
      style={delay ? ({ ...style, '--reveal-delay': `${delay}ms` } as CSSProperties) : style}
    >
      {children}
    </Tag>
  );
}
