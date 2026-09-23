import Image from 'next/image';
import Link from 'next/link';

import { FrameTrace } from '@/components/frame-trace';
import { ArrowRight } from '@/components/icons';
import { formatPrice } from '@/lib/format';
import type { Product } from '@/lib/types';

type ProductCardProps = {
  product: Product;
  /** Thứ tự trong lưới, dùng để ưu tiên tải ảnh của vài thẻ đầu tiên. */
  priority?: boolean;
  sizes?: string;
};

export function ProductCard({
  product,
  priority = false,
  sizes = '(min-width: 1280px) 20rem, (min-width: 768px) 30vw, 45vw',
}: ProductCardProps) {
  const image = product.images[0];

  return (
    <article className="frame-trace h-full">
      <Link
        href={`/products/${product.slug}`}
        className="card-surface group flex h-full flex-col overflow-hidden"
      >
        {/* Ảnh sản phẩm chụp trên nền trắng nên khung ảnh cũng để trắng, không lộ mép ảnh. */}
        <div className="relative aspect-square overflow-hidden bg-white">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              sizes={sizes}
              priority={priority}
              className="object-contain p-5"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs tracking-[0.18em] text-muted uppercase">
              Đang cập nhật ảnh
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col border-t border-line p-5 md:p-6">
          <p className="text-[0.625rem] font-semibold tracking-[0.2em] text-accent uppercase">
            {product.line || product.category}
          </p>
          <h3 className="mt-2.5 font-sans text-[0.9375rem] leading-snug font-semibold text-ink md:text-base">
            {product.name}
          </h3>
          {product.intro ? (
            <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-muted">
              {product.intro}
            </p>
          ) : null}
          <div className="mt-auto flex items-end justify-between gap-4 pt-5">
            <span className="text-base font-semibold text-ink">{formatPrice(product.price)}</span>
            <span
              className="icon-chip icon-chip-sm h-9 w-9 transition-colors group-hover:bg-accent group-hover:text-white"
              aria-hidden="true"
            >
              <ArrowRight className="h-4 w-4" />
            </span>
            <span className="sr-only">Xem chi tiết</span>
          </div>
        </div>
      </Link>
      <FrameTrace />
    </article>
  );
}
