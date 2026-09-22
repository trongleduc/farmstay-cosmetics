import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';

import { FrameTrace } from '@/components/frame-trace';
import { ArrowRight, featureIcon } from '@/components/icons';
import { Numerals } from '@/components/numerals';
import { ProductCard } from '@/components/product-card';
import { Reveal } from '@/components/reveal';
import { SectionHeading } from '@/components/section-heading';
import { SocialIconRow } from '@/components/social-links';
import { formatPrice } from '@/lib/format';
import { categoryArt, editorial } from '@/lib/imagery';
import { getFacets, getFeaturedProducts, getProducts } from '@/lib/products';
import {
  bannerHighlights,
  brandDirections,
  categoryBlurbs,
  coreValues,
  socialLinks,
} from '@/lib/site';

export default async function HomePage() {
  const [products, featured, facets] = await Promise.all([
    getProducts(),
    getFeaturedProducts(5),
    getFacets(),
  ]);

  const [lead, ...rest] = featured;
  const newest = products.slice(0, 3);

  // Ảnh minh họa của mỗi phân loại lấy từ `lib/imagery.ts`; phân loại chưa có
  // ảnh riêng thì mượn ảnh của một sản phẩm thuộc phân loại đó.
  const categoryCards = facets.categories.map((facet) => {
    const art = categoryArt[facet.value];
    const product = products.find((item) => item.category === facet.value && item.images.length);
    return {
      ...facet,
      blurb: categoryBlurbs[facet.value] ?? `${facet.count} sản phẩm Farmstay.`,
      image: art ?? (product ? { src: product.images[0], alt: product.name } : null),
      // Ảnh sản phẩm chụp nền trắng thì đặt lọt khung, ảnh bối cảnh thì phủ kín.
      cover: Boolean(art),
    };
  });

  // Dải ảnh cuối trang: lấy ảnh đầu tiên của năm sản phẩm khác nhau.
  const gallery = products.filter((item) => item.images.length).slice(0, 5);

  return (
    <>
      {/* ------------------------------------------------------- Banner đầu trang */}
      <section className="relative isolate -mt-18 flex flex-col overflow-hidden bg-cream md:-mt-22 md:block md:bg-transparent">
        {/*
          Ảnh banner là ảnh ngang, sản phẩm nằm lệch phải. Cắt giữa trên màn hình
          dọc sẽ xén mất sản phẩm và đẩy chữ đè lên nó, nên trên di động ảnh tách
          thành một dải riêng nằm dưới phần chữ; từ md trở lên mới phủ kín nền.
        */}
        <div className="relative order-2 h-64 w-full sm:h-80 md:absolute md:inset-0 md:order-none md:-z-20 md:h-full">
          <Image
            src={editorial.banner.src}
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="100vw"
            data-intro="zoom"
            className="object-cover object-[72%_center] md:scale-105 md:object-center"
          />
          {/* Chuyển tiếp mềm giữa nền chữ và dải ảnh, chỉ dùng trên di động */}
          <div
            className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-cream to-transparent md:hidden"
            aria-hidden="true"
          />
        </div>

        {/* Lớp phủ sáng ở nửa trái để phần chữ luôn đọc rõ mà vẫn thấy được ảnh.
            Trên di động chữ đã nằm trên nền kem nên không cần lớp phủ này. */}
        <div
          className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-white/65 via-white/25 to-transparent md:block"
          aria-hidden="true"
        />

        <div className="container-page order-1 pt-18 md:order-none md:pt-22">
          <div className="flex max-w-2xl flex-col justify-center py-14 sm:py-16 md:min-h-[34rem] md:py-24 lg:min-h-[38rem] lg:py-28">
            {/* Khối chữ dùng hiệu ứng vào trang (animation CSS chạy ngay khi dựng)
                thay cho reveal theo cuộn, vì nó đã nằm sẵn trong khung nhìn. */}
            <div data-intro style={{ '--intro-delay': '150ms' } as CSSProperties}>
              <h1 className="font-display text-[2.25rem] leading-[1.08] text-ink sm:text-5xl lg:text-[3.75rem]">
                Vẻ đẹp an toàn
                <br />
                dành cho tất cả
              </h1>
            </div>
            <div data-intro style={{ '--intro-delay': '260ms' } as CSSProperties}>
              <p className="lead mt-6 max-w-md sm:mt-7">
                Farmstay phát triển các sản phẩm chăm sóc da lấy cảm hứng từ thiên nhiên, kết hợp
                cùng nghiên cứu công thức hiện đại, để mỗi làn da đều tìm được giải pháp phù hợp.
              </p>
            </div>
            <div data-intro style={{ '--intro-delay': '370ms' } as CSSProperties}>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 sm:mt-9">
                <Link href="/products" className="btn">
                  Khám phá sản phẩm
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/about" className="link-line text-ink hover:text-accent">
                  Câu chuyện thương hiệu
                </Link>
              </div>
            </div>
            <div data-intro style={{ '--intro-delay': '480ms' } as CSSProperties}>
              <div className="mt-10 flex max-w-md items-center gap-4 border-t border-line pt-6 sm:mt-12 sm:gap-5 sm:pt-7">
                <p className="shrink-0 text-2xl leading-none font-semibold text-ink whitespace-nowrap tabular-nums sm:text-[1.75rem]">
                  1,8 triệu
                </p>
                <p className="text-xs leading-relaxed text-muted">
                  chai Collagen &amp; Hyaluronic Acid All-in-One Ampoule đã được bán ra
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ Dải điểm nhấn dưới banner */}
      <section className="border-y border-line bg-sand">
        <div className="container-page">
          <ul className="grid gap-x-8 gap-y-6 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:py-9">
            {bannerHighlights.map((item, index) => {
              const Icon = featureIcon(item.icon);
              return (
                <Reveal
                  as="li"
                  key={item.label}
                  delay={index * 70}
                  className="flex items-center gap-4"
                >
                  <span className="icon-chip icon-chip-sm bg-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm leading-snug font-medium text-ink-soft">
                    {item.label}
                  </span>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------ Giới thiệu thương hiệu */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-page">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
            <Reveal variant="left" className="lg:col-span-5">
              <div className="frame-trace relative aspect-3/4 overflow-hidden rounded-2xl border border-line bg-cream">
                <Image
                  src={editorial.brand.src}
                  alt={editorial.brand.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
                <FrameTrace />
              </div>
            </Reveal>

            <div className="lg:col-span-7">
              <Reveal>
                <p className="eyebrow">Về Farmstay</p>
                <h2 className="mt-5 font-display text-3xl leading-tight text-ink md:text-4xl lg:text-[2.75rem]">
                  Chủ nghĩa tự nhiên
                  <br />
                  thông minh
                </h2>
              </Reveal>
              <Reveal delay={110}>
                <div className="mt-7 space-y-5 text-[0.9375rem] leading-[1.9] text-ink-soft">
                  <p>
                    Farmstay được phát triển bởi Myungin Cosmetics Co., Ltd., có trụ sở tại Gimpo,
                    Gyeonggi-do, Hàn Quốc. Thương hiệu được định vị theo tinh thần{' '}
                    <span className="text-ink">“Smart Naturalism”</span> — kết hợp những giá trị từ
                    thiên nhiên với nghiên cứu và phát triển sản phẩm chăm sóc da.
                  </p>
                  <p>
                    Thay vì một công thức cho tất cả, Farmstay xây dựng hệ sinh thái chăm sóc da đa
                    dạng với nhiều nhóm sản phẩm như Tea Tree Biome, Cica Farm, Collagen,
                    Hyaluronic Acid, Retinol, Black Snail &amp; Peptide, phục vụ nhiều loại da và
                    nhiều mối quan tâm khác nhau.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={190}>
                <Link href="/about" className="btn-outline btn mt-9">
                  Tìm hiểu thêm
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- Giá trị cốt lõi */}
      <section className="border-y border-line bg-cream py-20 md:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="Giá trị cốt lõi"
            title="Năm điều Farmstay theo đuổi"
            description="Những nguyên tắc định hình cách thương hiệu nghiên cứu, phát triển và giới thiệu sản phẩm đến người dùng."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {coreValues.map((value, index) => {
              const Icon = featureIcon(value.icon);
              return (
                <Reveal key={value.index} delay={index * 70}>
                  <div className="card-surface flex h-full flex-col p-6 lg:p-7">
                    <div className="flex items-center justify-between gap-3">
                      <span className="icon-chip">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-2xl font-semibold text-line-strong tabular-nums">
                        {value.index}
                      </span>
                    </div>
                    <h3 className="mt-6 text-sm tracking-[0.04em] text-ink">{value.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{value.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Sản phẩm nổi bật */}
      {lead ? (
        <section className="bg-white py-20 md:py-28">
          <div className="container-page">
            <SectionHeading
              eyebrow="Sản phẩm nổi bật"
              title="Được lựa chọn nhiều nhất"
              description="Những sản phẩm tiêu biểu trong danh mục chăm sóc da của Farmstay."
              aside={
                <Link href="/products" className="link-line text-ink hover:text-accent">
                  Xem tất cả sản phẩm
                  <ArrowRight className="h-4 w-4" />
                </Link>
              }
            />

            <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:gap-10">
              {/* Sản phẩm dẫn đầu, khối lớn */}
              <Reveal className="lg:col-span-5">
                <article className="frame-trace h-full">
                  <Link
                    href={`/products/${lead.slug}`}
                    className="card-surface group flex h-full flex-col overflow-hidden"
                  >
                    {/* Ảnh giãn theo chiều cao để khối lớn cân với lưới bốn thẻ bên cạnh. */}
                    <div className="relative min-h-80 flex-1 bg-white">
                      {lead.images[0] ? (
                        <Image
                          src={lead.images[0]}
                          alt={lead.name}
                          fill
                          priority
                          sizes="(min-width: 1024px) 40vw, 100vw"
                          className="object-contain p-8"
                        />
                      ) : null}
                    </div>
                    <div className="border-t border-line p-7 md:p-8">
                      <p className="text-[0.625rem] font-semibold tracking-[0.2em] text-accent uppercase">
                        {lead.line || lead.category}
                      </p>
                      <h3 className="mt-3 font-display text-2xl leading-snug text-ink md:text-[1.75rem]">
                        <Numerals>{lead.name}</Numerals>
                      </h3>
                      <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted">
                        {lead.intro}
                      </p>
                      <div className="mt-7 flex items-center justify-between gap-4">
                        <span className="text-lg font-semibold text-ink">
                          {formatPrice(lead.price)}
                        </span>
                        <span className="link-line text-ink group-hover:text-accent">
                          Xem chi tiết
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                  <FrameTrace />
                </article>
              </Reveal>

              <div className="grid gap-8 sm:grid-cols-2 lg:col-span-7 lg:gap-10">
                {rest.map((product, index) => (
                  <Reveal key={product.id} delay={80 + index * 80}>
                    <ProductCard
                      product={product}
                      sizes="(min-width: 1024px) 26vw, (min-width: 640px) 45vw, 90vw"
                    />
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ------------------------------------------------- Dải ảnh câu chuyện */}
      <section className="relative isolate overflow-hidden bg-ink">
        <Image
          src={editorial.storyBand.src}
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="-z-20 object-cover opacity-45"
        />
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/80 to-ink/30"
          aria-hidden="true"
        />

        <div className="container-page">
          <div className="max-w-2xl py-24 md:py-36">
            <Reveal>
              <p className="eyebrow text-accent-soft">Brand story</p>
            </Reveal>
            <Reveal delay={100}>
              <blockquote className="mt-6 font-display text-3xl leading-[1.25] text-white md:text-[2.75rem]">
                “You are valuable because you are different.”
              </blockquote>
            </Reveal>
            <Reveal delay={180}>
              <p className="mt-7 text-[0.9375rem] leading-[1.9] text-white/70">
                Bạn có giá trị bởi vì bạn khác biệt. Mỗi làn da đều khác nhau, mỗi người đều có một
                nhu cầu chăm sóc riêng, và mỗi sự khác biệt đều xứng đáng được trân trọng.
              </p>
            </Reveal>
            <Reveal delay={250}>
              <Link href="/about" className="btn-light btn mt-10">
                Đọc câu chuyện thương hiệu
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- Phân loại sản phẩm */}
      {categoryCards.length ? (
        <section className="border-y border-line bg-cream py-16 md:py-24">
          <div className="container-page">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
              {/* Cột giới thiệu bên trái, các thẻ phân loại trải sang phải */}
              <Reveal className="lg:col-span-4 lg:flex lg:flex-col lg:justify-between lg:py-2">
                <div>
                  <h2 className="font-display text-[1.75rem] leading-[1.2] text-ink md:text-[2rem]">
                    Khám phá
                    <br />
                    danh mục sản phẩm
                  </h2>
                  <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted lg:max-w-[17rem]">
                    Tìm thấy sản phẩm phù hợp với nhu cầu làm đẹp của bạn.
                  </p>
                </div>
                {/* self-start để gạch chân của liên kết ôm đúng phần chữ,
                    thay vì kéo dài hết cột khi cột là flex dọc. */}
                <Link
                  href="/products"
                  className="link-line mt-8 text-ink hover:text-accent lg:self-start"
                >
                  Xem tất cả sản phẩm
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Reveal>

              <div className="grid gap-6 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
                {categoryCards.map((card, index) => (
                  <Reveal key={card.value} delay={index * 80}>
                    <article className="frame-trace h-full">
                      <Link
                        href={`/products?category=${encodeURIComponent(card.value)}`}
                        className="card-surface group flex h-full flex-col overflow-hidden"
                      >
                        <div className="relative aspect-4/3 overflow-hidden bg-cream">
                          {card.image ? (
                            <Image
                              src={card.image.src}
                              alt={card.image.alt}
                              fill
                              sizes="(min-width: 1024px) 26vw, (min-width: 640px) 45vw, 90vw"
                              className={card.cover ? 'object-cover' : 'object-contain p-6'}
                            />
                          ) : null}
                        </div>
                        <div className="flex flex-1 flex-col border-t border-line p-5 md:p-6">
                          <div className="flex items-baseline justify-between gap-3">
                            <h3 className="text-xs leading-snug font-semibold tracking-[0.14em] text-ink uppercase">
                              {card.value}
                            </h3>
                            <span className="shrink-0 text-[0.6875rem] text-muted tabular-nums">
                              {card.count}
                            </span>
                          </div>
                          <div className="mt-auto flex items-end justify-between gap-4 pt-4">
                            <p className="text-sm leading-relaxed text-muted">{card.blurb}</p>
                            <ArrowRight
                              className="mb-1 h-4 w-4 shrink-0 text-line-strong transition-all duration-500 group-hover:translate-x-1 group-hover:text-accent"
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      </Link>
                      <FrameTrace />
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ---------------------------------------------------- Dòng sản phẩm */}
      {facets.lines.length ? (
        <section className="bg-white py-20 md:py-28">
          <div className="container-page">
            <SectionHeading
              eyebrow="Dòng sản phẩm"
              title="Tìm theo dòng sản phẩm"
              description="Mỗi dòng sản phẩm được phát triển cho một nhu cầu chăm sóc da cụ thể."
            />

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {facets.lines.map((line, index) => (
                <Reveal key={line.value} delay={index * 60}>
                  <Link
                    href={`/products?line=${encodeURIComponent(line.value)}`}
                    className="card-surface group flex h-full items-center justify-between gap-6 px-6 py-5 hover:bg-cream"
                  >
                    <div>
                      <h3 className="text-[0.9375rem] tracking-[0.02em] text-ink">{line.value}</h3>
                      <p className="mt-1 text-sm text-muted">{line.count} sản phẩm</p>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-line-strong transition-all duration-500 group-hover:translate-x-1 group-hover:text-accent" />
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* -------------------------------------------------- Định hướng thương hiệu */}
      <section className="relative isolate overflow-hidden border-y border-line py-20 md:py-28">
        {/* Ảnh nền để lộ rất nhẹ dưới lớp phủ màu cát, đủ tạo chất liệu mà vẫn
            giữ chữ và thẻ trắng phía trên đọc rõ. */}
        <Image
          src={editorial.directions.src}
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="-z-20 object-cover object-center"
        />
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-b from-sand/85 via-sand/35 to-sand/95"
          aria-hidden="true"
        />

        <div className="container-page">
          <SectionHeading
            eyebrow="Định hướng"
            title="Vì sao chọn Farmstay"
            description="Thương hiệu tập trung vào bốn định hướng phát triển xuyên suốt."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {brandDirections.map((item, index) => {
              const Icon = featureIcon(item.icon);
              return (
                <Reveal key={item.title} delay={index * 80}>
                  <div className="card-surface flex h-full flex-col p-7">
                    <span className="icon-chip">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-6 text-base leading-snug text-ink">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- Mới cập nhật */}
      {newest.length ? (
        <section className="bg-white py-20 md:py-28">
          <div className="container-page">
            <SectionHeading
              eyebrow="Gợi ý"
              title="Cho quy trình hằng ngày"
              aside={
                <Link href="/products" className="link-line text-ink hover:text-accent">
                  Toàn bộ danh mục
                  <ArrowRight className="h-4 w-4" />
                </Link>
              }
            />
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
              {newest.map((product, index) => (
                <Reveal key={product.id} delay={index * 80}>
                  <ProductCard
                    product={product}
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ------------------------------------------------------- Dải ảnh theo dõi */}
      {gallery.length ? (
        <section className="border-t border-line bg-cream py-16 md:py-20">
          <div className="container-page">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
              <Reveal className="lg:col-span-4">
                <p className="eyebrow">Theo dõi Farmstay</p>
                <h2 className="mt-4 font-display text-3xl leading-tight text-ink md:text-4xl">
                  Cùng chăm sóc
                  <br />
                  làn da mỗi ngày
                </h2>
                <p className="mt-5 text-sm leading-relaxed text-muted">
                  Theo dõi các kênh chính thức để cập nhật sản phẩm mới và những gợi ý chăm sóc da
                  từ Farmstay.
                </p>
                <SocialIconRow items={socialLinks} className="mt-7" />
              </Reveal>

              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-5">
                {gallery.map((product, index) => (
                  <Reveal as="li" key={product.id} delay={index * 60}>
                    <Link
                      href={`/products/${product.slug}`}
                      className="frame-trace relative block aspect-square overflow-hidden rounded-2xl border border-line bg-white"
                    >
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(min-width: 1024px) 14vw, (min-width: 640px) 30vw, 45vw"
                        className="object-contain p-4"
                      />
                      <FrameTrace />
                    </Link>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
