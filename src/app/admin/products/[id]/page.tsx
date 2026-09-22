import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { ProductForm } from '@/components/admin/product-form';
import { isAuthenticated } from '@/lib/auth';
import { getProductById } from '@/lib/products';
import { productCategories, productConcerns, productLines } from '@/lib/taxonomy';

export default async function EditProductPage(props: PageProps<'/admin/products/[id]'>) {
  if (!(await isAuthenticated())) redirect('/admin/login');

  const { id } = await props.params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <>
      <nav aria-label="Đường dẫn" className="mb-8 text-xs text-muted">
        <Link href="/admin" className="transition-colors hover:text-ink">
          Danh sách sản phẩm
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-3xl text-ink">Chỉnh sửa sản phẩm</h1>
        <Link
          href={`/products/${product.slug}`}
          target="_blank"
          className="text-sm text-muted transition-colors hover:text-ink"
        >
          Xem trên website
        </Link>
      </div>

      <ProductForm
        product={product}
        suggestions={{
          lines: [...productLines],
          categories: [...productCategories],
          concerns: [...productConcerns],
        }}
      />
    </>
  );
}
