'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

const INTERVAL_MS = 2000;

export type BannerSlide = {
  src: string;
  alt: string;
  /** Lớp Tailwind đặt điểm neo `object-position` cho màn hình rộng. */
  position?: string;
};

type HeroCarouselProps = {
  /** Banner chính (ảnh nền, chữ và nút), dựng sẵn ở server. */
  children: ReactNode;
  /** Các banner chỉ có ảnh, chạy nối tiếp sau banner chính. */
  slides: readonly BannerSlide[];
  className?: string;
};

/**
 * Carousel banner đầu trang chủ, tự chuyển mỗi 2 giây bằng hiệu ứng mờ dần.
 *
 * Banner chính nằm ở lớp dưới cùng và quyết định chiều cao của cả khối; các
 * banner ảnh phủ lên trên rồi hiện dần, nên chiều cao trang không nhảy khi
 * đổi ảnh. Lúc banner ảnh đang phủ, phần chữ và nút bên dưới được đặt `inert`
 * để không nhận focus hay bị đọc bởi trình đọc màn hình.
 *
 * Tạm dừng khi rê chuột hoặc focus vào banner, khi tab bị ẩn, và không tự chạy
 * khi người dùng tắt hiệu ứng chuyển động.
 */
export function HeroCarousel({ children, slides, className }: HeroCarouselProps) {
  const total = slides.length + 1;
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => setReducedMotion(media.matches);
    const onVisibility = () => setHidden(document.hidden);
    onMotion();
    media.addEventListener('change', onMotion);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      media.removeEventListener('change', onMotion);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const paused = hovered || focused || hidden || reducedMotion;

  // Đặt lại hẹn giờ mỗi lần đổi ảnh, kể cả khi người dùng bấm chấm chuyển ảnh,
  // để ảnh vừa chọn luôn được hiện đủ 2 giây.
  useEffect(() => {
    if (paused || total < 2) return;
    const timer = window.setTimeout(() => setActive((i) => (i + 1) % total), INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [active, paused, total]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Banner"
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      // Chỉ dừng khi focus bằng bàn phím; bấm chuột vào chấm chuyển ảnh vẫn giữ
      // focus trên nút, nếu dừng cả trường hợp đó thì carousel sẽ đứng luôn.
      onFocus={(event) => setFocused(event.target.matches(':focus-visible'))}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      {/* `contents` giữ nguyên bố cục flex của banner chính */}
      <div className="contents" inert={active !== 0}>
        {children}
      </div>

      {slides.map((slide, index) => {
        const isActive = active === index + 1;
        return (
          <div
            key={slide.src}
            aria-hidden={!isActive}
            className={`absolute inset-0 z-10 overflow-hidden bg-cream transition-opacity duration-700 ease-out motion-reduce:transition-none ${
              isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            {/* Trên màn hình hẹp, ảnh hiện trọn khung; phần trống phía sau là
                chính ảnh đó phóng to và làm mờ để không lộ nền trơn. */}
            <Image
              src={slide.src}
              alt=""
              fill
              sizes="20vw"
              className="scale-110 object-cover opacity-60 blur-2xl md:hidden"
            />
            {/* Ảnh bắt đầu dưới header để phần chữ in trong ảnh không bị header che */}
            <div className="absolute inset-x-0 top-18 bottom-0 md:top-22">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="100vw"
                className={`object-contain transition-transform duration-[2400ms] ease-out md:object-cover ${
                  slide.position ?? ''
                } ${isActive ? 'scale-100' : 'scale-[1.03]'}`}
              />
            </div>
          </div>
        );
      })}

      <div className="absolute inset-x-0 bottom-5 z-20 flex justify-center gap-2.5 md:bottom-7">
        {Array.from({ length: total }, (_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Xem banner ${index + 1}`}
            aria-current={active === index ? 'true' : undefined}
            className="group flex h-6 items-center"
          >
            <span
              className={`block h-1.5 rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.6)] transition-all duration-500 ${
                active === index ? 'w-7 bg-ink' : 'w-1.5 bg-ink/30 group-hover:bg-ink/60'
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
