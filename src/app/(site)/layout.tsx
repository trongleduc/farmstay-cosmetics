import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export default function SiteLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <a
        href="#noi-dung"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-white"
      >
        Bỏ qua và đến nội dung chính
      </a>
      <SiteHeader />
      <main id="noi-dung" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
