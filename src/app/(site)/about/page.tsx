import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { FrameTrace } from '@/components/frame-trace';
import { ArrowRight, CheckIcon, featureIcon } from '@/components/icons';
import { Reveal } from '@/components/reveal';
import { SectionHeading } from '@/components/section-heading';
import { editorial } from '@/lib/imagery';
import { brandDirections, brandLines, coreValues, site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Giới thiệu thương hiệu',
  description:
    'Farmstay — thương hiệu mỹ phẩm Hàn Quốc theo định hướng Smart Naturalism, phát triển bởi Myungin Cosmetics Co., Ltd. Tìm hiểu lịch sử, tầm nhìn, sứ mệnh và giá trị cốt lõi của thương hiệu.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: `Giới thiệu thương hiệu | ${site.name}`,
    description:
      'Câu chuyện, tầm nhìn và giá trị cốt lõi của thương hiệu mỹ phẩm Hàn Quốc Farmstay.',
    url: '/about',
  },
};

const missionPoints = [
  'Phát triển sản phẩm phù hợp với nhiều loại da.',
  'Khai thác những giá trị từ các thành phần có nguồn gốc thiên nhiên.',
  'Không ngừng nghiên cứu và phát triển sản phẩm.',
  'Tôn trọng sự khác biệt về làn da và nhu cầu làm đẹp.',
  'Theo đuổi vẻ đẹp an toàn, tự nhiên và phù hợp với từng cá nhân.',
];

export default function AboutPage() {
  return (
    <>
      {/* ------------------------------------------------------------- Mở đầu */}
      <section className="border-b border-line bg-white">
        <div className="container-page">
          <div className="grid gap-12 py-14 lg:grid-cols-12 lg:gap-16 lg:py-24">
            <div className="lg:col-span-6">
              <Reveal>
                <p className="eyebrow">Giới thiệu</p>
              </Reveal>
              <Reveal delay={90}>
                {/* Ngắt dòng cứng chỉ áp dụng từ sm trở lên; màn hình hẹp để chữ
                    tự xuống dòng cho khỏi lẻ chữ. */}
                <h1 className="mt-6 font-display text-[2rem] leading-[1.12] text-ink sm:text-5xl lg:text-[3.25rem]">
                  Chăm sóc da lấy cảm hứng
                  <br className="hidden sm:inline" />{' '}
                  từ thiên nhiên
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="lead mt-7 max-w-xl">
                  Farmstay là thương hiệu mỹ phẩm Hàn Quốc phát triển đa dạng các dòng sản phẩm chăm
                  sóc da, nhằm đáp ứng nhu cầu của nhiều loại da và nhiều mối quan tâm khác nhau.
                </p>
              </Reveal>
            </div>

            <Reveal variant="right" delay={140} className="lg:col-span-6">
              <div className="frame-trace relative aspect-16/11 overflow-hidden rounded-2xl border border-line bg-cream">
                <Image
                  src={editorial.aboutPortrait.src}
                  alt={editorial.aboutPortrait.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
                <FrameTrace />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- Thông tin công ty */}
      <section className="border-b border-line bg-white py-20 md:py-28">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
            <Reveal className="lg:col-span-4">
              <p className="eyebrow">Thông tin công ty</p>
              <h2 className="mt-5 font-display text-3xl leading-tight text-ink md:text-4xl">
                Myungin Cosmetics Co., Ltd.
              </h2>
            </Reveal>

            <div className="lg:col-span-8">
              <Reveal delay={90}>
                <div className="space-y-5 text-[0.9375rem] leading-[1.9] text-ink-soft">
                  <p>
                    <span className="font-medium text-ink">FARMSTAY</span> là thương hiệu mỹ phẩm
                    Hàn Quốc theo định hướng chăm sóc da lấy cảm hứng từ thiên nhiên, phát triển đa
                    dạng các dòng sản phẩm nhằm đáp ứng nhu cầu của nhiều loại da và nhiều mối quan
                    tâm khác nhau.
                  </p>
                  <p>
                    Farmstay được phát triển bởi Myungin Cosmetics Co., Ltd., có trụ sở tại Gimpo,
                    Gyeonggi-do, Hàn Quốc. Thương hiệu được định vị là một thương hiệu{' '}
                    <span className="text-ink">“Smart Naturalism” — chủ nghĩa tự nhiên thông
                    minh</span>, hướng đến việc kết hợp những giá trị từ thiên nhiên với nghiên cứu
                    và phát triển sản phẩm chăm sóc da.
                  </p>
                  <p>
                    Farmstay hiện phát triển nhiều nhóm sản phẩm như Tea Tree Biome, Cica Farm,
                    Collagen, Hyaluronic Acid, Retinol, Black Snail &amp; Peptide cùng nhiều dòng
                    chăm sóc da khác.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={160}>
                <dl className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
                  {[
                    { label: 'Thương hiệu', value: 'Farmstay' },
                    { label: 'Đơn vị phát triển', value: 'Myungin Cosmetics Co., Ltd.' },
                    { label: 'Xuất xứ', value: 'Gimpo, Gyeonggi-do, Hàn Quốc' },
                  ].map((item) => (
                    <div key={item.label} className="bg-white p-6">
                      <dt className="text-[0.625rem] font-semibold tracking-[0.2em] text-muted uppercase">
                        {item.label}
                      </dt>
                      <dd className="mt-3 text-[0.9375rem] leading-relaxed text-ink">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ Lịch sử */}
      <section className="border-b border-line bg-cream py-20 md:py-28">
        <div className="container-page">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-6">
              <Reveal>
                <p className="eyebrow">Lịch sử</p>
                <h2 className="mt-5 font-display text-[1.75rem] leading-tight text-ink sm:text-3xl md:text-4xl lg:text-[2.75rem]">
                  Hệ sinh thái chăm sóc da
                  <br className="hidden sm:inline" />{' '}
                  được xây dựng dần theo thời gian
                </h2>
              </Reveal>
              <Reveal delay={110}>
                <div className="mt-7 space-y-5 text-[0.9375rem] leading-[1.9] text-ink-soft">
                  <p>
                    Farmstay được xây dựng trong lĩnh vực mỹ phẩm Hàn Quốc với định hướng phát triển
                    các sản phẩm chăm sóc da kết hợp giữa giá trị thiên nhiên và nghiên cứu công
                    thức hiện đại.
                  </p>
                  <p>
                    Thương hiệu giới thiệu mình theo định hướng Smart Naturalism, đồng thời phát
                    triển nhiều dòng sản phẩm cho những nhu cầu chăm sóc da khác nhau, với các dòng
                    nổi bật như Cica Farm, Collagen, Tea Tree Biome, bên cạnh những sản phẩm chứa
                    Hyaluronic Acid, Retinol, Snail và các thành phần chăm sóc da khác.
                  </p>
                  <p>
                    Điều này cho thấy định hướng của Farmstay không tập trung vào một nhóm sản phẩm
                    đơn lẻ, mà xây dựng một hệ sinh thái chăm sóc da đa dạng, phục vụ nhiều nhu cầu
                    và loại da.
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal variant="right" delay={140} className="lg:col-span-6">
              <div className="frame-trace relative rounded-2xl border border-line bg-white p-8 md:p-12">
                <p className="eyebrow">Sản phẩm tiêu biểu</p>
                <p className="mt-6 text-[2.5rem] leading-none font-semibold text-ink tabular-nums md:text-[3rem]">
                  1,8 triệu
                </p>
                <p className="mt-3 text-sm tracking-[0.04em] text-muted">chai đã được bán ra</p>
                <div className="hairline my-8" />
                <div className="relative mx-auto aspect-square w-40 overflow-hidden rounded-2xl md:w-48">
                  <Image
                    src={editorial.aboutDetail.src}
                    alt={editorial.aboutDetail.alt}
                    fill
                    sizes="12rem"
                    className="object-cover"
                  />
                </div>
                <p className="mt-7 text-[0.9375rem] leading-relaxed text-ink-soft">
                  Collagen &amp; Hyaluronic Acid All-in-One Ampoule 250ml — sản phẩm tiêu biểu được
                  website thương hiệu giới thiệu với doanh số vượt 1,8 triệu chai.
                </p>
                <FrameTrace />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- Tầm nhìn & Sứ mệnh */}
      <section className="border-b border-line bg-white py-20 md:py-28">
        <div className="container-page">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <p className="eyebrow">Tầm nhìn</p>
              <p className="mt-6 font-display text-2xl leading-[1.35] text-ink md:text-[1.75rem]">
                Trở thành thương hiệu mỹ phẩm chăm sóc da được tin tưởng trên thị trường quốc tế,
                mang những giải pháp làm đẹp lấy cảm hứng từ thiên nhiên đến với nhiều người hơn.
              </p>
              <div className="mt-8 space-y-5 text-[0.9375rem] leading-[1.9] text-ink-soft">
                <p>
                  Farmstay hướng đến một quan niệm rằng không có một tiêu chuẩn duy nhất cho vẻ đẹp.
                  Mỗi người có đặc điểm làn da, nhu cầu và vẻ đẹp riêng.
                </p>
                <p>
                  Vì vậy, thương hiệu tập trung nghiên cứu và phát triển các sản phẩm đa dạng để
                  người tiêu dùng có thể tìm thấy giải pháp phù hợp với làn da của mình.
                </p>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <p className="eyebrow">Sứ mệnh</p>
              <p className="mt-6 font-display text-2xl leading-[1.35] text-ink md:text-[1.75rem]">
                Mang đến những sản phẩm chăm sóc da an toàn, hiệu quả và phù hợp với sự đa dạng của
                người tiêu dùng, đồng thời giúp mỗi người tự tin với vẻ đẹp riêng của mình.
              </p>
              <ul className="mt-8 space-y-4">
                {missionPoints.map((point) => (
                  <li
                    key={point}
                    className="flex gap-3.5 border-b border-line pb-4 text-[0.9375rem] leading-relaxed text-ink-soft last:border-b-0"
                  >
                    <span
                      className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-wash text-accent"
                      aria-hidden="true"
                    >
                      <CheckIcon className="h-3 w-3" strokeWidth={2} />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- Brand story */}
      <section className="relative isolate overflow-hidden bg-ink">
        <Image
          src={editorial.aboutWide.src}
          alt={editorial.aboutWide.alt}
          fill
          sizes="100vw"
          className="-z-10 object-cover opacity-30"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/90 via-ink/80 to-ink/95" />

        <div className="container-page">
          <div className="mx-auto max-w-3xl py-24 text-center md:py-32">
            <Reveal>
              <p className="eyebrow text-accent-soft">Brand story</p>
            </Reveal>
            <Reveal delay={90}>
              <h2 className="mt-6 font-display text-3xl leading-[1.25] text-white md:text-[2.75rem]">
                You are valuable
                <br />
                because you are different
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 text-lg text-white/70">Bạn có giá trị bởi vì bạn khác biệt.</p>
            </Reveal>
            <Reveal delay={220}>
              <div className="mx-auto mt-10 max-w-2xl space-y-5 text-[0.9375rem] leading-[1.9] text-white/65">
                <p>
                  Farmstay tin rằng vẻ đẹp không được tạo nên từ một khuôn mẫu duy nhất. Mỗi làn da
                  đều khác nhau. Mỗi người đều có một nhu cầu chăm sóc riêng. Và mỗi sự khác biệt
                  đều xứng đáng được trân trọng.
                </p>
                <p>
                  Từ triết lý đó, Farmstay không ngừng nghiên cứu và phát triển những sản phẩm chăm
                  sóc da đa dạng, theo đuổi sự cân bằng giữa giá trị thiên nhiên và công nghệ chăm
                  sóc da hiện đại.
                </p>
              </div>
            </Reveal>
            <Reveal delay={280}>
              <p className="mt-12 font-display text-xl leading-relaxed text-white md:text-2xl">
                “Bạn không cần thay đổi để trở nên đẹp.
                <br />
                Bạn chỉ cần chăm sóc và trân trọng vẻ đẹp vốn có của mình.”
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- Giá trị cốt lõi */}
      <section className="border-b border-line bg-white py-20 md:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="Giá trị cốt lõi"
            title="Năm giá trị định hình thương hiệu"
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
                      <span className="text-2xl font-semibold text-line-strong tabular-nums">{value.index}</span>
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

      {/* ------------------------------------------------ Định hướng thương hiệu */}
      <section className="border-b border-line bg-cream py-20 md:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="Định hướng thương hiệu"
            title="Bốn hướng phát triển chính"
            description="Farmstay hướng đến hình ảnh một thương hiệu K-Beauty hiện đại, dễ tiếp cận và đa dạng, trong đó chăm sóc da không chỉ là một bước làm đẹp mà còn là một phần của lối sống."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {brandDirections.map((item, index) => {
              const Icon = featureIcon(item.icon);
              return (
                <Reveal key={item.title} delay={index * 80}>
                  <div className="card-surface flex h-full gap-5 p-7 md:p-8">
                    <span className="icon-chip">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-base leading-snug text-ink md:text-lg">{item.title}</h3>
                      <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- Hệ sinh thái */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="Hệ sinh thái sản phẩm"
            title="Các dòng chăm sóc da tiêu biểu"
            aside={
              <Link href="/products" className="link-line text-ink hover:text-accent">
                Xem danh mục
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {brandLines.map((line, index) => (
              <Reveal key={line.name} delay={index * 70}>
                <div className="card-surface h-full p-7 md:p-8">
                  <span className="tag">{line.name}</span>
                  <p className="mt-5 text-sm leading-relaxed text-muted">{line.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120}>
            <p className="mt-10 max-w-3xl text-sm leading-relaxed text-muted">
              Website Farmstay nhấn mạnh cam kết trân trọng sự đa dạng và hướng đến việc tạo ra,
              thúc đẩy “safe beauty for all” — vẻ đẹp an toàn dành cho tất cả.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
