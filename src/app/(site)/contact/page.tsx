import type { Metadata } from 'next';
import Image from 'next/image';

import { FrameTrace } from '@/components/frame-trace';
import { MailIcon, MapPinIcon, PhoneIcon, socialIcon } from '@/components/icons';
import { Reveal } from '@/components/reveal';
import { editorial } from '@/lib/imagery';
import { company, salesChannels, site, socialLinks } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Liên hệ',
  description: `Thông tin liên hệ ${company.name} — ${company.address}. Điện thoại ${company.phone}, email ${company.email}.`,
  alternates: { canonical: '/contact' },
  openGraph: {
    title: `Liên hệ | ${site.name}`,
    description: `Thông tin liên hệ và địa chỉ của ${company.name}.`,
    url: '/contact',
  },
};

const contactRows = [
  { label: 'Công ty', value: company.name },
  { label: 'Mã số thuế', value: company.taxCode },
  { label: 'Người đại diện', value: company.representative },
  { label: 'Địa chỉ', value: company.address },
];

function LocalBusinessJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.name,
    url: site.url,
    email: company.email,
    telephone: company.phone,
    taxID: company.taxCode,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '43 Thâm Tâm, Yên Hoà',
      addressLocality: 'Cầu Giấy',
      addressRegion: 'Hà Nội',
      addressCountry: 'VN',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function ContactPage() {
  const channels = [...socialLinks, ...salesChannels].filter((item) => item.href);

  return (
    <>
      <LocalBusinessJsonLd />

      <section className="border-b border-line bg-white">
        <div className="container-page">
          <div className="grid gap-12 py-14 lg:grid-cols-12 lg:gap-16 lg:py-20">
            <div className="lg:col-span-6">
              <Reveal>
                <p className="eyebrow">Liên hệ</p>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="mt-5 font-display text-[2rem] leading-[1.12] text-ink sm:text-[2.25rem] md:text-5xl">
                  Chúng tôi luôn sẵn sàng
                  <br className="hidden sm:inline" />{' '}
                  lắng nghe bạn
                </h1>
              </Reveal>
              <Reveal delay={150}>
                <p className="lead mt-6 max-w-xl">
                  Liên hệ để được tư vấn sản phẩm phù hợp với làn da, tìm hiểu về hợp tác phân phối
                  hoặc nhận thông tin về các kênh bán hàng chính thức.
                </p>
              </Reveal>

              <Reveal delay={210}>
                <div className="mt-10 grid gap-5 sm:grid-cols-2">
                  <a
                    href={company.phoneHref}
                    className="frame-trace card-surface flex items-start gap-4 p-6"
                  >
                    <span className="icon-chip icon-chip-sm">
                      <PhoneIcon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.625rem] font-semibold tracking-[0.2em] text-muted uppercase">
                        Điện thoại
                      </span>
                      <span className="mt-2 block text-xl font-semibold text-ink tabular-nums">
                        {company.phone}
                      </span>
                    </span>
                    <FrameTrace />
                  </a>
                  <a
                    href={`mailto:${company.email}`}
                    className="frame-trace card-surface flex items-start gap-4 p-6"
                  >
                    <span className="icon-chip icon-chip-sm">
                      <MailIcon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.625rem] font-semibold tracking-[0.2em] text-muted uppercase">
                        Email
                      </span>
                      <span className="mt-2 block text-sm break-words text-ink">
                        {company.email}
                      </span>
                    </span>
                    <FrameTrace />
                  </a>
                </div>
              </Reveal>
            </div>

            <Reveal variant="right" delay={140} className="lg:col-span-6">
              <div className="frame-trace relative aspect-4/3 overflow-hidden rounded-2xl border border-line bg-cream">
                <Image
                  src={editorial.contact.src}
                  alt={editorial.contact.alt}
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

      {/* ------------------------------------------------ Thông tin & bản đồ */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <h2 className="font-display text-2xl text-ink md:text-3xl">Thông tin doanh nghiệp</h2>
              </Reveal>
              <Reveal delay={90}>
                <dl className="mt-8 border-t border-line">
                  {contactRows.map((row) => (
                    <div
                      key={row.label}
                      className="grid gap-1 border-b border-line py-4 sm:grid-cols-3 sm:gap-6"
                    >
                      <dt className="text-sm text-muted">{row.label}</dt>
                      <dd className="text-[0.9375rem] leading-relaxed text-ink sm:col-span-2">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>

              {channels.length ? (
                <Reveal delay={150}>
                  <div className="mt-10">
                    <h3 className="text-[0.625rem] font-semibold tracking-[0.2em] text-muted uppercase">
                      Kênh chính thức
                    </h3>
                    <div className="mt-5 flex flex-wrap gap-3">
                      {channels.map((channel) => {
                        const Icon = socialIcon(channel.label);
                        return (
                          <a
                            key={channel.label}
                            href={channel.href}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white px-4 py-2.5 text-sm text-ink-soft transition-colors hover:border-accent-soft hover:bg-accent-wash hover:text-accent"
                          >
                            <Icon className="h-4 w-4" />
                            {channel.label}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </Reveal>
              ) : null}

              <Reveal delay={200}>
                <a
                  href={company.mapsUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn-outline btn mt-10"
                >
                  Mở trên Google Maps
                </a>
              </Reveal>
            </div>

            <Reveal variant="right" delay={120} className="lg:col-span-7">
              <div className="frame-trace relative h-[22rem] overflow-hidden rounded-2xl border border-line bg-cream md:h-[32rem]">
                <iframe
                  src={company.mapsEmbedUrl}
                  title={`Bản đồ đến ${company.name}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="h-full w-full"
                />
                <FrameTrace />
              </div>
              <p className="mt-4 flex items-start gap-2.5 text-sm text-muted">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {company.address}
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
