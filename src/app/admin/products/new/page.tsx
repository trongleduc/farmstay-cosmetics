import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ProductForm } from '@/components/admin/product-form';
import { isAuthenticated } from '@/lib/auth';
import { productCategories, productConcerns, productLines } from '@/lib/taxonomy';

export default async function NewProductPage() {
  if (!(await isAuthenticated())) redirect('/admin/login');

  return (
    <>
      <nav aria-label="Đường dẫn" className="mb-8 text-xs text-muted">
        <Link href="/admin" className="transition-colors hover:text-ink">
          Danh sách sản phẩm
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-ink">Thêm mới</span>
      </nav>

      <h1 className="mb-8 font-display text-3xl text-ink">Thêm sản phẩm</h1>

      <ProductForm
        suggestions={{
          lines: [...productLines],
          categories: [...productCategories],
          concerns: [...productConcerns],
        }}
      />
    </>
  );
}
