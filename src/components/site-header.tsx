'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { PhoneIcon, SearchIcon } from '@/components/icons';
import { SocialIconRow } from '@/components/social-links';
import { company, mainNav, site, socialLinks } from '@/lib/site';

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Khóa cuộn nền khi menu di động đang mở.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? 'bg-white/95 backdrop-blur-md shadow-[0_1px_0_0_var(--color-line),0_10px_30px_-24px_rgba(20,17,15,0.35)]'
          : 'bg-white/75 backdrop-blur-md'
      }`}
    >
      <div className="container-page">
        <div
          className={`flex h-18 items-center gap-4 border-b md:h-22 md:gap-6 transition-colors duration-300 ${
            scrolled ? 'border-line' : 'border-line/40'
          }`}
        >
          <Link href="/" className="group flex shrink-0 flex-col leading-none" aria-label={site.name}>
            <span className="font-display text-2xl tracking-[0.3em] text-ink md:text-[1.75rem]">
              {site.brand}
            </span>
            <span className="mt-1 text-[0.5625rem] tracking-[0.34em] text-muted uppercase">
              {site.tagline}
            </span>
          </Link>

          <nav
            className="hidden flex-1 items-center justify-center gap-9 lg:flex"
            aria-label="Điều hướng chính"
          >
            {mainNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className="group relative py-2 text-[0.8125rem] font-medium tracking-[0.06em] text-ink-soft transition-colors hover:text-ink"
                >
                  {item.label}
                  <span
                    className={`absolute inset-x-0 -bottom-px h-px origin-left bg-accent transition-transform duration-500 ease-out ${
                      active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0 lg:gap-3">
            {/* Tìm kiếm nằm trong trang danh mục nên biểu tượng dẫn thẳng tới đó. */}
            <Link href="/products" className="social-dot" aria-label="Tìm sản phẩm">
              <SearchIcon className="h-4 w-4" />
            </Link>

            <SocialIconRow items={socialLinks} className="hidden xl:flex" />

            <span className="hidden h-5 w-px bg-line xl:block" aria-hidden="true" />

            <a
              href={company.phoneHref}
              className="btn btn-sm btn-soft hidden md:inline-flex"
              aria-label={`Gọi ${company.phone}`}
            >
              <PhoneIcon className="h-4 w-4" />
              {company.phone}
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-cream lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
            >
              <span className="relative block h-3 w-6">
                <span
                  className={`absolute left-0 block h-px w-full bg-ink transition-all duration-300 ${
                    menuOpen ? 'top-1.5 rotate-45' : 'top-0'
                  }`}
                />
                <span
                  className={`absolute left-0 block h-px w-full bg-ink transition-all duration-300 ${
                    menuOpen ? 'top-1.5 -rotate-45' : 'top-3'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      <div id="mobile-menu" hidden={!menuOpen} className="border-b border-line bg-white lg:hidden">
        <nav className="container-page py-4" aria-label="Điều hướng di động">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`block border-b border-line py-4 text-[0.9375rem] tracking-[0.04em] last:border-b-0 ${
                isActive(pathname, item.href) ? 'text-accent' : 'text-ink'
              }`}
            >
              {item.label}
            </Link>
          ))}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-cream px-5 py-4">
            <a
              href={company.phoneHref}
              className="inline-flex items-center gap-2.5 text-sm font-medium tracking-[0.04em] text-ink"
            >
              <PhoneIcon className="h-4 w-4 text-accent" />
              {company.phone}
            </a>
            <SocialIconRow items={socialLinks} />
          </div>
        </nav>
      </div>
    </header>
  );
}
