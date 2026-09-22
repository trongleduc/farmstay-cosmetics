import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { deleteProductAction, toggleFeaturedAction } from '@/app/admin/actions';
import { ConfirmSubmit } from '@/components/admin/confirm-submit';
import { isAuthenticated } from '@/lib/auth';
import { formatPrice } from '@/lib/format';
import { getProducts } from '@/lib/products';

const STATUS_MESSAGES: Record<string, string> = {
  'da-them': 'Đã thêm sản phẩm mới.',
  'da-cap-nhat': 'Đã cập nhật sản phẩm.',
  'da-xoa': 'Đã xóa sản phẩm.',
};

export default async function AdminProductsPage(props: PageProps<'/admin'>) {
  if (!(await isAuthenticated())) redirect('/admin/login');

  const searchParams = await props.searchParams;
  const statusKey = Array.isArray(searchParams['trang-thai'])
    ? searchParams['trang-thai'][0]
    : searchParams['trang-thai'];
  const status = statusKey ? STATUS_MESSAGES[statusKey] : undefined;

  const products = await getProducts();
  const featuredCount = products.filter((p) => p.featured).length;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-3xl text-ink">Danh sách sản phẩm</h1>
          <p className="mt-3 text-sm text-muted">
            {products.length} sản phẩm · {featuredCount} đang nổi bật trên trang chủ
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="btn btn-sm"
        >
          Thêm sản phẩm
        </Link>
      </div>

      {status ? (
        <p className="mt-8 rounded-xl border border-line bg-white px-5 py-4 text-sm text-ink">{status}</p>
      ) : null}

      {products.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-line bg-white px-6 py-20 text-center">
          <p className="font-display text-xl text-ink">Chưa có sản phẩm nào</p>
          <p className="mt-3 text-sm text-muted">Bấm “Thêm sản phẩm” để tạo mục đầu tiên.</p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[56rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-line">
                {['Sản phẩm', 'Phân loại', 'Giá', 'Nổi bật', 'Thứ tự', ''].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="px-5 py-4 text-[0.625rem] font-semibold tracking-[0.18em] text-muted uppercase"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-line last:border-b-0">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-line bg-white">
                        {product.images[0] ? (
                          <Image
                            src={product.images[0]}
                            alt=""
                            fill
                            sizes="3.5rem"
                            className="object-contain p-1"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="block text-sm font-medium text-ink underline-offset-4 hover:underline"
                        >
                          {product.name}
                        </Link>
                        <p className="mt-1 truncate text-xs text-muted">/{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-ink-soft">
                    <p>{product.line || '—'}</p>
                    <p className="mt-1 text-xs text-muted">{product.category}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-ink tabular-nums">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-5 py-4">
                    <form action={toggleFeaturedAction}>
                      <input type="hidden" name="id" value={product.id} />
                      <button
                        type="submit"
                        className={`border px-3 py-1.5 text-xs transition-colors ${
                          product.featured
                            ? 'border-accent text-accent hover:bg-accent hover:text-white'
                            : 'border-line text-muted hover:border-ink hover:text-ink'
                        }`}
                      >
                        {product.featured ? 'Đang nổi bật' : 'Chưa nổi bật'}
                      </button>
                    </form>
                  </td>
                  <td className="px-5 py-4 text-sm text-ink-soft tabular-nums">{product.order}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        href={`/products/${product.slug}`}
                        target="_blank"
                        className="text-xs text-muted transition-colors hover:text-ink"
                      >
                        Xem
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-xs text-ink-soft transition-colors hover:text-ink"
                      >
                        Sửa
                      </Link>
                      <form action={deleteProductAction}>
                        <input type="hidden" name="id" value={product.id} />
                        <ConfirmSubmit
                          message={`Xóa sản phẩm “${product.name}”? Thao tác này không thể hoàn tác.`}
                          className="text-xs text-muted transition-colors hover:text-accent"
                        >
                          Xóa
                        </ConfirmSubmit>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
