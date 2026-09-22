'use client';

import Image from 'next/image';
import { useState } from 'react';

import { FrameTrace } from '@/components/frame-trace';

type ProductGalleryProps = {
  images: string[];
  name: string;
};

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  if (!active) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl border border-line bg-cream text-xs tracking-[0.18em] text-muted uppercase">
        Đang cập nhật ảnh
      </div>
    );
  }

  return (
    <div>
      <div className="frame-trace relative aspect-square overflow-hidden rounded-2xl border border-line bg-white">
        <Image
          key={active}
          src={active}
          alt={name}
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-contain p-6 md:p-10"
        />
        <FrameTrace />
      </div>

      {images.length > 1 ? (
        <ul className="mt-4 grid grid-cols-5 gap-3 sm:grid-cols-6 sm:gap-4">
          {images.map((image, index) => {
            const selected = index === activeIndex;
            return (
              <li key={image}>
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Xem ảnh ${index + 1} của ${name}`}
                  aria-pressed={selected}
                  className={`frame-trace relative block aspect-square w-full overflow-hidden rounded-xl border bg-white transition-colors ${
                    selected ? 'border-accent' : 'border-line hover:border-line-strong'
                  }`}
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="8rem"
                    className="object-contain p-2"
                  />
                  {selected ? null : <FrameTrace radius={12} />}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
