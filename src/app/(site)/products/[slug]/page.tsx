import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArrowRight, CheckIcon, PhoneIcon } from '@/components/icons';
import { Numerals } from '@/components/numerals';
import { ProductCard } from '@/components/product-card';
import { ProductGallery } from '@/components/product-gallery';
import { Reveal } from '@/components/reveal';
import { formatPrice, toParagraphs } from '@/lib/format';
import { getProductBySlug, getProducts, getRelatedProducts } from '@/lib/products';
import { company, site } from '@/lib/site';
import type { Product } from '@/lib/types';

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata(props: PageProps<'/products/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Không tìm thấy sản phẩm' };

  const description =
    product.intro || product.overview.slice(0, 180) || `${product.name} — ${site.name}`;

  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: 'website',
      title: `${product.name} | ${site.name}`,
      description,
      url: `/products/${product.slug}`,
      images: product.images[0]
        ? [{ url: product.images[0], width: 700, height: 700, alt: product.name }]
        : undefined,
    },
  };
}

function TextBlock({ title, body }: { title: string; body: string }) {
  const paragraphs = toParagraphs(body);
  if (!paragraphs.length) return null;

  return (
    <Reveal as="section" className="border-t border-line pt-10">
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      <div className="rich-text mt-5 max-w-3xl text-[0.9375rem] leading-[1.9]">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </Reveal>
  );
}

function ProductJsonLd({ product }: { product: Product }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.intro || product.overview,
    image: product.images.map((image) => `${site.url}${image}`),
    brand: { '@type': 'Brand', name: site.brand },
    category: product.category,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${site.url}/products/${product.slug}`,
      seller: { '@type': 'Organization', name: company.name },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function ProductDetailPage(props: PageProps<'/products/[slug]'>) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);
  const tags = [product.line, product.category, product.concern].filter(Boolean);

  return (
    <>
      <ProductJsonLd product={product} />

      {/* ------------------------------------------------------- Đường dẫn */}
      <nav aria-label="Đường dẫn" className="border-b border-line bg-white">
        <div className="container-page">
          <ol className="flex flex-wrap items-center gap-2 py-5 text-xs text-muted">
            <li>
              <Link href="/" className="transition-colors hover:text-ink">
                Trang chủ
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/products" className="transition-colors hover:text-ink">
                Sản phẩm
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-ink">{product.name}</li>
          </ol>
        </div>
      </nav>

      {/* --------------------------------------------------- Ảnh và thông tin */}
      <section className="bg-white py-12 md:py-16">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-6">
              <div className="lg:sticky lg:top-28">
                <ProductGallery images={product.images} name={product.name} />
              </div>
            </Reveal>

            <div className="lg:col-span-6">
              <Reveal delay={80}>
                <div className="flex flex-wrap items-center gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="tag"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h1 className="mt-6 font-display text-[2rem] leading-[1.15] text-ink md:text-[2.5rem]">
                  <Numerals>{product.name}</Numerals>
                </h1>
                <p className="mt-5 text-2xl font-medium text-ink">{formatPrice(product.price)}</p>
              </Reveal>

              {product.intro ? (
                <Reveal delay={140}>
                  <p className="lead mt-7">{product.intro}</p>
                </Reveal>
              ) : null}

              {product.benefits.length ? (
                <Reveal delay={190}>
                  <ul className="mt-8 space-y-4 border-t border-line pt-8">
                    {product.benefits.map((benefit) => (
                      <li
                        key={benefit}
                        className="flex gap-3.5 text-[0.9375rem] leading-relaxed text-ink-soft"
                      >
                        <span
                          className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-wash text-accent"
                          aria-hidden="true"
                        >
                          <CheckIcon className="h-3 w-3" strokeWidth={2} />
                        </span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ) : null}

              {product.specs.length ? (
                <Reveal delay={240}>
                  <dl className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
                    {product.specs.slice(0, 4).map((spec) => (
                      <div key={spec.label} className="bg-white p-5">
                        <dt className="text-[0.625rem] font-semibold tracking-[0.18em] text-muted uppercase">
                          {spec.label}
                        </dt>
                        <dd className="mt-2 text-sm leading-relaxed text-ink">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </Reveal>
              ) : null}

              <Reveal delay={290}>
                <div className="mt-10 rounded-2xl border border-line bg-cream p-7">
                  <p className="font-display text-xl text-ink">Đặt hàng &amp; tư vấn</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    Liên hệ trực tiếp để được tư vấn sản phẩm phù hợp với làn da và nhận thông tin
                    về các kênh phân phối chính thức.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <a href={company.phoneHref} className="btn">
                      <PhoneIcon className="h-4 w-4" />
                      Gọi {company.phone}
                    </a>
                    <Link href="/contact" className="link-line text-ink hover:text-accent">
                      Thông tin liên hệ
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- Thông tin chi tiết */}
      <section className="bg-white pb-20 md:pb-28">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="space-y-10 lg:col-span-8">
              <TextBlock title="Mô tả chi tiết" body={product.overview} />

              {product.specs.length ? (
                <Reveal as="section" className="border-t border-line pt-10">
                  <h2 className="font-display text-2xl text-ink">Thông tin sản phẩm</h2>
                  <dl className="mt-6 border-t border-line">
                    {product.specs.map((spec) => (
                      <div
                        key={spec.label}
                        className="grid gap-1 border-b border-line py-4 sm:grid-cols-3 sm:gap-6"
                      >
                        <dt className="text-sm font-medium text-ink">{spec.label}</dt>
                        <dd className="text-[0.9375rem] leading-relaxed whitespace-pre-line text-ink-soft sm:col-span-2">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </Reveal>
              ) : null}

              <TextBlock title="Thành phần" body={product.ingredients} />
              <TextBlock title="Hướng dẫn sử dụng" body={product.usage} />

              {toParagraphs(product.caution).length ? (
                <Reveal as="section" className="border-t border-line pt-10">
                  <h2 className="font-display text-2xl text-ink">Lưu ý khi sử dụng</h2>
                  <ul className="mt-6 space-y-3">
                    {toParagraphs(product.caution).map((line, index) => (
                      <li
                        key={index}
                        className="flex gap-4 text-[0.9375rem] leading-relaxed text-ink-soft"
                      >
                        <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-soft" aria-hidden="true" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ) : null}
            </div>

            <aside className="lg:col-span-4">
              <Reveal delay={100}>
                <div className="card-surface p-7 lg:sticky lg:top-28">
                  <p className="eyebrow">Phân loại</p>
                  <dl className="mt-6 space-y-5 text-sm">
                    {product.line ? (
                      <div>
                        <dt className="text-muted">Dòng sản phẩm</dt>
                        <dd className="mt-1">
                          <Link
                            href={`/products?line=${encodeURIComponent(product.line)}`}
                            className="text-ink underline-offset-4 transition-colors hover:text-accent hover:underline"
                          >
                            {product.line}
                          </Link>
                        </dd>
                      </div>
                    ) : null}
                    {product.category ? (
                      <div>
                        <dt className="text-muted">Phân loại</dt>
                        <dd className="mt-1">
                          <Link
                            href={`/products?category=${encodeURIComponent(product.category)}`}
                            className="text-ink underline-offset-4 transition-colors hover:text-accent hover:underline"
                          >
                            {product.category}
                          </Link>
                        </dd>
                      </div>
                    ) : null}
                    {product.concern ? (
                      <div>
                        <dt className="text-muted">Vấn đề da</dt>
                        <dd className="mt-1">
                          <Link
                            href={`/products?concern=${encodeURIComponent(product.concern)}`}
                            className="text-ink underline-offset-4 transition-colors hover:text-accent hover:underline"
                          >
                            {product.concern}
                          </Link>
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                </div>
              </Reveal>
            </aside>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- Sản phẩm liên quan */}
      {related.length ? (
        <section className="border-t border-line bg-cream py-20 md:py-24">
          <div className="container-page">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <Reveal>
                <p className="eyebrow">Gợi ý</p>
                <h2 className="mt-4 font-display text-3xl text-ink md:text-4xl">
                  Có thể bạn quan tâm
                </h2>
              </Reveal>
              <Reveal delay={100}>
                <Link href="/products" className="link-line text-ink hover:text-accent">
                  Xem tất cả
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Reveal>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item, index) => (
                <Reveal key={item.id} delay={index * 70}>
                  <ProductCard
                    product={item}
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
