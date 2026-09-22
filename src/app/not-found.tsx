import Link from 'next/link';

import { ArrowRight } from '@/components/icons';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="container-page">
          <div className="mx-auto max-w-xl py-28 text-center md:py-40">
            <p className="eyebrow">Lỗi 404</p>
            <h1 className="mt-6 font-display text-[2.5rem] leading-tight text-ink md:text-5xl">
              Không tìm thấy trang
            </h1>
            <p className="lead mt-6">
              Trang bạn tìm có thể đã được đổi đường dẫn hoặc không còn tồn tại. Bạn có thể quay về
              trang chủ hoặc xem toàn bộ danh mục sản phẩm.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              <Link href="/" className="btn">
                Về trang chủ
              </Link>
              <Link href="/products" className="link-line text-ink hover:text-accent">
                Xem sản phẩm
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
