import type { Metadata } from 'next';
import Link from 'next/link';

import { SearchIcon } from '@/components/icons';
import { ProductCard } from '@/components/product-card';
import {
  buildHref,
  hasActiveFilter,
  ProductTabs,
  SORT_OPTIONS,
  type ProductQuery,
} from '@/components/product-tabs';
import { Reveal } from '@/components/reveal';
import { getProducts, getTaxonomy } from '@/lib/products';
import { site } from '@/lib/site';
import type { Product } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Sản phẩm',
  description:
    'Danh mục sản phẩm chăm sóc da Farmstay: ampoule, toner, kem dưỡng, mặt nạ và chăm sóc da tay. Lọc theo dòng sản phẩm, phân loại và vấn đề da.',
  alternates: { canonical: '/products' },
  openGraph: {
    title: `Sản phẩm | ${site.name}`,
    description: 'Danh mục sản phẩm chăm sóc da Farmstay.',
    url: '/products',
  },
};

/** Bỏ dấu tiếng Việt để tìm kiếm không phụ thuộc vào cách gõ. */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd');
}

function firstValue(value: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  const trimmed = raw?.trim();
  return trimmed ? trimmed : undefined;
}

function applyFilters(products: Product[], query: ProductQuery): Product[] {
  let result = products;

  if (query.line) result = result.filter((p) => p.line === query.line);
  if (query.category) result = result.filter((p) => p.category === query.category);
  if (query.concern) result = result.filter((p) => p.concern === query.concern);

  if (query.q) {
    const needle = normalize(query.q);
    result = result.filter((p) =>
      normalize([p.name, p.line, p.category, p.concern, p.intro].join(' ')).includes(needle),
    );
  }

  switch (query.sort) {
    case 'price-asc':
      return [...result].sort((a, b) => a.price - b.price);
    case 'price-desc':
      return [...result].sort((a, b) => b.price - a.price);
    case 'name':
      return [...result].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    default:
      return result;
  }
}

export default async function ProductsPage(props: PageProps<'/products'>) {
  const searchParams = await props.searchParams;
  const query: ProductQuery = {
    line: firstValue(searchParams.line),
    category: firstValue(searchParams.category),
    concern: firstValue(searchParams.concern),
    q: firstValue(searchParams.q),
    sort: firstValue(searchParams.sort),
  };

  const [products, groups] = await Promise.all([getProducts(), getTaxonomy()]);
  const filtered = applyFilters(products, query);
  const filtering = hasActiveFilter(query) || Boolean(query.q);

  return (
    <>
      <section className="bg-white">
        <div className="container-page">
          <div className="max-w-2xl py-12 md:py-16">
            <Reveal>
              <p className="eyebrow">Danh mục</p>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-5 font-display text-[2.25rem] leading-[1.12] text-ink md:text-5xl">
                Sản phẩm Farmstay
              </h1>
            </Reveal>
            <Reveal delay={150}>
              <p className="lead mt-6">
                Mỗi sản phẩm được phát triển cho một nhu cầu chăm sóc da cụ thể. Chọn theo dòng sản
                phẩm, phân loại hoặc vấn đề da để tìm giải pháp phù hợp với làn da của bạn.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Thanh tab lọc */}
      <section className="border-y border-line bg-cream">
        <div className="container-page py-7 md:py-8">
          <ProductTabs groups={groups} query={query} total={products.length} />
        </div>
      </section>

      <section className="bg-white py-10 md:py-14">
        <div className="container-page">
          {/* ------------------------------------------ Số lượng, tìm kiếm, sắp xếp */}
          <div className="flex flex-col gap-5 border-b border-line pb-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            <p className="shrink-0 text-sm text-muted">
              <span className="font-medium text-ink tabular-nums">{filtered.length}</span> sản phẩm
              {filtered.length !== products.length ? (
                <span className="tabular-nums"> / {products.length}</span>
              ) : null}
            </p>

            <form action="/products" className="relative w-full lg:max-w-xs">
              {query.line ? <input type="hidden" name="line" value={query.line} /> : null}
              {query.category ? (
                <input type="hidden" name="category" value={query.category} />
              ) : null}
              {query.concern ? <input type="hidden" name="concern" value={query.concern} /> : null}
              {query.sort ? <input type="hidden" name="sort" value={query.sort} /> : null}

              <label htmlFor="tim-kiem" className="sr-only">
                Tìm sản phẩm
              </label>
              <SearchIcon
                className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <input
                id="tim-kiem"
                name="q"
                type="search"
                defaultValue={query.q ?? ''}
                placeholder="Tìm sản phẩm..."
                className="field pl-11"
              />
            </form>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="text-[0.625rem] font-semibold tracking-[0.2em] text-muted uppercase">
                Sắp xếp
              </span>
              {SORT_OPTIONS.map((option) => {
                const selected = (query.sort ?? 'default') === option.value;
                return (
                  <Link
                    key={option.value}
                    href={buildHref(query, {
                      sort: option.value === 'default' ? undefined : option.value,
                    })}
                    className={`text-sm transition-colors ${
                      selected
                        ? 'border-b border-accent pb-px text-ink'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    {option.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {filtered.length ? (
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-9">
              {filtered.map((product, index) => (
                <Reveal key={product.id} delay={(index % 4) * 70}>
                  <ProductCard
                    product={product}
                    priority={index < 4}
                    sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                  />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-2xl border border-line bg-cream px-8 py-20 text-center">
              <p className="font-display text-2xl text-ink">Không tìm thấy sản phẩm phù hợp</p>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
                {filtering
                  ? 'Hãy thử bỏ bớt một vài bộ lọc hoặc tìm với từ khóa khác.'
                  : 'Danh mục đang được cập nhật.'}
              </p>
              <Link href="/products" className="btn-outline btn mt-8">
                Xem tất cả sản phẩm
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
