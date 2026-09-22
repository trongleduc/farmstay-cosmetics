import type { Metadata } from 'next';
import Link from 'next/link';

import { logoutAction } from '@/app/admin/actions';
import { isAuthenticated } from '@/lib/auth';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Quản trị sản phẩm',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: LayoutProps<'/admin'>) {
  const authed = await isAuthenticated();

  // Trang đăng nhập dùng chung layout này nhưng không có thanh điều hướng.
  if (!authed) return <div className="flex min-h-screen flex-col bg-cream">{children}</div>;

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-8">
          <div className="flex items-baseline gap-4">
            <Link href="/admin" className="font-display text-lg tracking-[0.24em] text-ink">
              {site.brand}
            </Link>
            <span className="text-[0.625rem] font-semibold tracking-[0.2em] text-muted uppercase">
              Quản trị sản phẩm
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              target="_blank"
              className="text-sm text-ink-soft transition-colors hover:text-ink"
            >
              Xem website
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-sm text-ink-soft transition-colors hover:text-ink"
              >
                Đăng xuất
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-5 py-10 md:px-8 md:py-12">{children}</div>
      </main>
    </div>
  );
}
