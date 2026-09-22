import Link from 'next/link';

import type { TaxonomyGroup } from '@/lib/products';

export type ProductQuery = {
  line?: string;
  category?: string;
  concern?: string;
  q?: string;
  sort?: string;
};

export const SORT_OPTIONS = [
  { value: 'default', label: 'Mặc định' },
  { value: 'price-asc', label: 'Giá tăng dần' },
  { value: 'price-desc', label: 'Giá giảm dần' },
  { value: 'name', label: 'Tên A–Z' },
] as const;

/** Dựng đường dẫn mới từ bộ lọc hiện tại, bỏ trống các tham số không dùng. */
export function buildHref(query: ProductQuery, patch: Partial<ProductQuery>): string {
  const next = { ...query, ...patch };
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(next)) {
    if (value) params.set(key, value);
  }
  const qs = params.toString();
  return qs ? `/products?${qs}` : '/products';
}

/** Có đang lọc theo danh mục nào không (không tính từ khóa và sắp xếp). */
export function hasActiveFilter(query: ProductQuery): boolean {
  return Boolean(query.line || query.category || query.concern);
}

type TabRowProps = {
  group: TaxonomyGroup;
  query: ProductQuery;
};

function TabRow({ group, query }: TabRowProps) {
  const active = query[group.key];

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
      <span className="shrink-0 text-[0.625rem] font-semibold tracking-[0.2em] text-muted uppercase md:w-36">
        {group.label}
      </span>

      {/* Danh mục dài bao nhiêu cũng chỉ cuộn ngang trong hàng của nó.
          Lớp mờ dần ở mép phải cho biết còn mục phía sau. */}
      <div className="tab-fade">
        <div className="tab-scroll">
          <Link
            href={buildHref(query, { [group.key]: undefined })}
            aria-current={active ? undefined : 'true'}
            className={`tab-chip${active ? '' : ' tab-chip-active'}`}
          >
            Tất cả
          </Link>

          {group.options.map((option) => {
            const selected = active === option.value;

            // Mục chưa có sản phẩm vẫn hiện để thấy đủ danh mục, nhưng không
            // bấm được vì bấm vào chỉ dẫn tới một trang rỗng.
            if (!option.count && !selected) {
              return (
                <span
                  key={option.value}
                  className="tab-chip tab-chip-empty"
                  title={`${option.value} — chưa có sản phẩm`}
                >
                  {option.value}
                  <span className="tab-chip-count">0</span>
                </span>
              );
            }

            return (
              <Link
                key={option.value}
                href={buildHref(query, { [group.key]: selected ? undefined : option.value })}
                aria-current={selected ? 'true' : undefined}
                className={`tab-chip${selected ? ' tab-chip-active' : ''}`}
              >
                {option.value}
                <span className="tab-chip-count">{option.count}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

type ProductTabsProps = {
  groups: TaxonomyGroup[];
  query: ProductQuery;
  /** Tổng số sản phẩm trong danh mục, dùng cho tab "Tất cả sản phẩm". */
  total: number;
};

/**
 * Bộ lọc dạng thanh tab ngang đặt phía trên lưới sản phẩm.
 * Mỗi trục phân loại là một hàng cuộn ngang riêng, trên cùng là tab gom tất cả.
 */
export function ProductTabs({ groups, query, total }: ProductTabsProps) {
  const filtering = hasActiveFilter(query);

  return (
    <div className="space-y-5">
      <div className="tab-scroll">
        <Link
          href={buildHref({ q: query.q, sort: query.sort }, {})}
          aria-current={filtering ? undefined : 'true'}
          className={`tab-chip${filtering ? '' : ' tab-chip-active'}`}
        >
          Tất cả sản phẩm
          <span className="tab-chip-count">{total}</span>
        </Link>

        {filtering ? (
          <Link href="/products" className="tab-chip">
            Xóa bộ lọc
          </Link>
        ) : null}
      </div>

      <div className="space-y-4 border-t border-line pt-5">
        {groups.map((group) => (
          <TabRow key={group.key} group={group} query={query} />
        ))}
      </div>
    </div>
  );
}
