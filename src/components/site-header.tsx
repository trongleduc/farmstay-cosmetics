'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

import { ArrowRight, CloseIcon, PhoneIcon, SearchIcon } from '@/components/icons';
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
  const [openPath, setOpenPath] = useState(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Khóa cuộn nền và cho phép đóng ngăn kéo bằng phím Esc khi menu đang mở.
  useEffect(() => {
    if (!menuOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  // Đổi trang (kể cả khi bấm nút lùi của trình duyệt) thì đóng ngăn kéo.
  // Chỉnh state ngay trong lúc dựng thay vì trong effect để không phải dựng lại
  // cả cây component một lần nữa.
  if (openPath !== pathname) {
    setOpenPath(pathname);
    if (menuOpen) setMenuOpen(false);
  }

  return (
    <>
      <header
        data-intro="drop"
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled || menuOpen
            ? 'bg-white/95 backdrop-blur-md shadow-[0_1px_0_0_var(--color-line),0_10px_30px_-24px_rgba(20,17,15,0.35)]'
            : 'bg-white/75 backdrop-blur-md'
        }`}
      >
        <div className="container-page">
          <div
            className={`flex h-18 items-center gap-3 border-b transition-colors duration-300 md:h-22 md:gap-6 ${
              scrolled ? 'border-line' : 'border-line/40'
            }`}
          >
            <Link
              href="/"
              className="group flex shrink-0 flex-col leading-none"
              aria-label={site.name}
            >
              <Image
                src="/logo.png"
                alt={site.name}
                width={574}
                height={116}
                priority
                className="h-6 w-auto sm:h-7 md:h-8"
              />
              <span className="mt-1.5 text-[0.5rem] tracking-[0.28em] text-muted uppercase sm:text-[0.5625rem] sm:tracking-[0.34em]">
                {site.tagline}
              </span>
            </Link>

            <nav
              className="hidden flex-1 items-center justify-center gap-9 lg:flex"
              aria-label="Điều hướng chính"
            >
              {mainNav.map((item, index) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    data-intro="fade"
                    style={{ '--intro-delay': `${260 + index * 80}ms` } as CSSProperties}
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

            <div className="ml-auto flex items-center gap-1.5 lg:ml-0 lg:gap-3">
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
                className="-mr-1.5 flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-cream lg:hidden"
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
      </header>

      {/* ----------------------------------------------- Ngăn kéo menu di động
          Đặt ngoài <header> vì header có backdrop-filter, phần tử position:
          fixed nằm bên trong sẽ bị neo vào header thay vì vào khung nhìn. */}
      <div
        aria-hidden="true"
        data-open={menuOpen}
        onClick={() => setMenuOpen(false)}
        className="drawer-scrim lg:hidden"
      />

      <div
        id="mobile-menu"
        data-open={menuOpen}
        inert={!menuOpen}
        className="drawer-panel lg:hidden"
      >
        <div className="flex h-18 shrink-0 items-center justify-between gap-4 border-b border-line px-5">
          <Image src="/logo.png" alt={site.name} width={574} height={116} className="h-6 w-auto" />
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-cream"
            aria-label="Đóng menu"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Danh sách dài hơn màn hình vẫn cuộn được trong ngăn kéo */}
        <nav className="scroll-slim flex-1 overflow-y-auto px-5 py-2" aria-label="Điều hướng di động">
          {mainNav.map((item, index) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
                style={{ '--drawer-index': index } as CSSProperties}
                className="drawer-link"
              >
                {item.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-line px-5 py-6">
          <a
            href={company.phoneHref}
            onClick={() => setMenuOpen(false)}
            className="btn btn-sm w-full"
          >
            <PhoneIcon className="h-4 w-4" />
            {company.phone}
          </a>
          <SocialIconRow items={socialLinks} className="mt-5 justify-center" />
        </div>
      </div>
    </>
  );
}
