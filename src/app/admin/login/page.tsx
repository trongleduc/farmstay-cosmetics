import { redirect } from 'next/navigation';

import { LoginForm } from '@/components/admin/login-form';
import { isAuthenticated } from '@/lib/auth';
import { site } from '@/lib/site';

export default async function AdminLoginPage(props: PageProps<'/admin/login'>) {
  if (await isAuthenticated()) redirect('/admin');

  const searchParams = await props.searchParams;
  const raw = searchParams['next'];
  const requested = Array.isArray(raw) ? raw[0] : raw;
  // Chỉ nhận đường dẫn nội bộ trong khu quản trị, tránh chuyển hướng ra ngoài.
  const next = requested && requested.startsWith('/admin') ? requested : '/admin';

  return (
    <div className="flex flex-1 items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-8 md:p-10">
        <p className="font-display text-xl tracking-[0.24em] text-ink">{site.brand}</p>
        <h1 className="mt-6 font-display text-2xl text-ink">Đăng nhập quản trị</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Khu vực dành cho quản trị viên quản lý danh mục sản phẩm.
        </p>

        <LoginForm next={next} />
      </div>
    </div>
  );
}
