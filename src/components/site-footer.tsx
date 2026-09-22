import Link from 'next/link';

import { socialIcon } from '@/components/icons';
import { SocialIconRow } from '@/components/social-links';
import { company, mainNav, salesChannels, site, socialLinks } from '@/lib/site';
import type { SocialLink } from '@/lib/site';

function ChannelList({ items, title }: { items: SocialLink[]; title: string }) {
  const linked = items.filter((item) => item.href);
  const pending = items.filter((item) => !item.href);

  return (
    <div>
      <h3 className="text-[0.6875rem] font-semibold tracking-[0.22em] text-white/50 uppercase">
        {title}
      </h3>
      <ul className="mt-5 space-y-3">
        {linked.map((item) => {
          const Icon = socialIcon(item.label);
          return (
            <li key={item.label}>
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer noopener"
                className="group inline-flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-white"
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="border-b border-transparent pb-px transition-colors group-hover:border-white/40">
                  {item.label}
                </span>
              </a>
            </li>
          );
        })}
        {pending.map((item) => {
          const Icon = socialIcon(item.label);
          return (
            <li key={item.label} title="Đang cập nhật đường dẫn kênh">
              <span className="inline-flex items-center gap-3 text-sm text-white/35">
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-ink text-white">
      <div className="container-page">
        <div className="grid gap-12 py-16 md:grid-cols-2 md:py-20 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-3">
            <div className="flex flex-col leading-none">
              <span className="font-display text-[1.75rem] tracking-[0.3em] text-white">
                {site.brand}
              </span>
              <span className="mt-2 text-[0.5625rem] tracking-[0.34em] text-white/45 uppercase">
                {site.tagline}
              </span>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/60">
              Thương hiệu mỹ phẩm Hàn Quốc theo định hướng chăm sóc da lấy cảm hứng từ thiên nhiên,
              hướng đến vẻ đẹp an toàn cho tất cả.
            </p>
            <SocialIconRow items={socialLinks} tone="dark" className="mt-7" />
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-[0.6875rem] font-semibold tracking-[0.22em] text-white/50 uppercase">
              Liên kết
            </h3>
            <ul className="mt-5 space-y-3">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <ChannelList title="Mạng xã hội" items={socialLinks} />
          </div>

          <div className="lg:col-span-2">
            <ChannelList title="Kênh bán hàng" items={salesChannels} />
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-[0.6875rem] font-semibold tracking-[0.22em] text-white/50 uppercase">
              Liên hệ
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              <li>
                <a href={company.phoneHref} className="transition-colors hover:text-white">
                  {company.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="transition-colors hover:text-white"
                >
                  {company.email}
                </a>
              </li>
              <li className="leading-relaxed">{company.address}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/12 py-8">
          <div className="grid gap-x-10 gap-y-2 text-xs leading-relaxed text-white/45 sm:grid-cols-2 lg:grid-cols-4">
            <p>{company.name}</p>
            <p>Mã số thuế: {company.taxCode}</p>
            <p>Người đại diện: {company.representative}</p>
            <p>Địa chỉ: {company.address}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/12 py-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. Bảo lưu mọi quyền.
          </p>
          <p>Thương hiệu Farmstay được phát triển bởi Myungin Cosmetics Co., Ltd. — Hàn Quốc.</p>
        </div>
      </div>
    </footer>
  );
}
