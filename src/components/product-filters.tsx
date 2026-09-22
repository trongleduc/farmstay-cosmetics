'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { CheckIcon, ChevronDownIcon, CloseIcon, SlidersIcon } from '@/components/icons';
import { buildHref, hasActiveFilter, type ProductQuery } from '@/lib/product-query';
import type { TaxonomyGroup } from '@/lib/products';

type DropdownProps = {
  group: TaxonomyGroup;
  query: ProductQuery;
  /** Vị trí nút trong hàng ba cột — quyết định cách neo bảng chọn. */
  index: number;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
};

function FilterDropdown({ group, query, index, open, onToggle, onClose }: DropdownProps) {
  const selected = query[group.key];
  const panelId = `filter-${group.key}`;

  return (
    <div className="filter-field lg:w-52" data-selected={Boolean(selected)}>
      {/* Nhãn đặt ngoài nút, nên nút chỉ còn một dòng chữ và mảnh hơn hẳn. */}
      <span className="filter-field__label" aria-hidden="true">
        <span className="lg:hidden">{group.short}</span>
        <span className="hidden lg:inline">{group.label}</span>
      </span>

      <button
        type="button"
        id={`${panelId}-trigger`}
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        // Nhãn hiện ra ngoài lại bị rút gọn ở màn hình hẹp, nên tên đọc được
        // của nút luôn lấy nhãn đầy đủ kèm lựa chọn hiện tại.
        aria-label={`${group.label}: ${selected ?? 'Tất cả'}`}
        title={selected}
        data-selected={Boolean(selected)}
        className="filter-trigger"
      >
        <span className="filter-trigger__value">{selected ?? 'Tất cả'}</span>
        <ChevronDownIcon className="filter-trigger__caret h-3.5 w-3.5" />
      </button>

      {open ? (
        <div
          id={panelId}
          role="listbox"
          aria-labelledby={`${panelId}-trigger`}
          data-index={index}
          className="filter-panel scroll-slim"
        >
          <Link
            href={buildHref(query, { [group.key]: undefined })}
            role="option"
            aria-selected={!selected}
            aria-current={selected ? undefined : 'true'}
            onClick={onClose}
            className="filter-option"
          >
            <span>Tất cả</span>
            {selected ? null : <CheckIcon className="h-4 w-4 shrink-0" strokeWidth={2} />}
          </Link>

          {group.options.map((option) => {
            const active = selected === option.value;

            // Mục chưa có sản phẩm vẫn hiện để thấy đủ danh mục, nhưng không
            // bấm được vì bấm vào chỉ dẫn tới một trang rỗng.
            if (!option.count && !active) {
              return (
                <span
                  key={option.value}
                  role="option"
                  aria-selected={false}
                  aria-disabled="true"
                  data-empty="true"
                  title={`${option.value} — chưa có sản phẩm`}
                  className="filter-option"
                >
                  <span>{option.value}</span>
                  <span className="filter-option__count">0</span>
                </span>
              );
            }

            return (
              <Link
                key={option.value}
                href={buildHref(query, { [group.key]: active ? undefined : option.value })}
                role="option"
                aria-selected={active}
                aria-current={active ? 'true' : undefined}
                onClick={onClose}
                className="filter-option"
              >
                <span>{option.value}</span>
                <span className="filter-option__count">{option.count}</span>
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

type ProductFiltersProps = {
  groups: TaxonomyGroup[];
  query: ProductQuery;
  /** Tổng số sản phẩm trong danh mục. */
  total: number;
  /** Số sản phẩm còn lại sau khi lọc. */
  resultCount: number;
};

/**
 * Thanh lọc dính ở đầu trang sản phẩm.
 *
 * Mỗi trục phân loại là một nút đổ xuống: danh mục dài bao nhiêu cũng nằm gọn
 * trong bảng chọn cuộn dọc, thay cho hàng cuộn ngang trước đây vốn không thao
 * tác được bằng chuột trên máy tính.
 *
 * Mỗi lựa chọn là một <Link> nên trạng thái lọc nằm hết trên URL: chia sẻ được,
 * bấm lùi được và trang kết quả vẫn dựng ở phía máy chủ. Riêng thao tác mở bảng
 * chọn cần JavaScript; khi tắt JavaScript trang vẫn liệt kê đủ sản phẩm.
 */
export function ProductFilters({ groups, query, total, resultCount }: ProductFiltersProps) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const filtering = hasActiveFilter(query);
  const active = groups
    .map((group) => ({ group, value: query[group.key] }))
    .filter((item): item is { group: TaxonomyGroup; value: string } => Boolean(item.value));

  // Bấm ra ngoài hoặc nhấn Esc thì đóng bảng chọn đang mở.
  useEffect(() => {
    if (!openKey) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpenKey(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenKey(null);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [openKey]);

  return (
    <div className="filter-bar">
      <div className="container-page">
        <div
          ref={rootRef}
          className="flex flex-col gap-3 py-3 lg:flex-row lg:items-end lg:gap-5 lg:py-3.5"
        >
          <p className="hidden shrink-0 items-center gap-2.5 pb-2.5 text-[0.625rem] font-semibold tracking-[0.2em] text-muted uppercase lg:flex">
            <SlidersIcon className="h-4 w-4 text-accent" />
            Lọc theo
          </p>

          <div className="grid grid-cols-3 gap-2 lg:flex lg:flex-1 lg:gap-3">
            {groups.map((group, index) => (
              <FilterDropdown
                key={group.key}
                group={group}
                query={query}
                index={index}
                open={openKey === group.key}
                onToggle={() => setOpenKey((current) => (current === group.key ? null : group.key))}
                onClose={() => setOpenKey(null)}
              />
            ))}
          </div>

          <div className="flex shrink-0 items-center justify-between gap-4 lg:justify-end lg:pb-2">
            <p className="text-xs text-muted">
              <span className="font-medium text-ink tabular-nums">{resultCount}</span>
              <span className="tabular-nums"> / {total}</span> sản phẩm
            </p>

            {filtering ? (
              <Link
                href={buildHref({ q: query.q, sort: query.sort }, {})}
                className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-accent"
              >
                <CloseIcon className="h-3.5 w-3.5" />
                Xóa bộ lọc
              </Link>
            ) : null}
          </div>
        </div>

        {/* Trên màn hình hẹp nút đổ xuống phải cắt bớt chữ, nên lựa chọn đang
            áp dụng được nhắc lại đủ tên ở đây; bấm vào chip là bỏ đúng bộ lọc
            đó. Từ lg trở lên nút đã đủ rộng để hiện tên nên bỏ hàng này cho
            thanh lọc mỏng lại. */}
        {active.length ? (
          <div className="chip-row border-t border-line/70 pt-2.5 pb-3 lg:hidden">
            <span className="text-[0.625rem] font-semibold tracking-[0.2em] text-muted uppercase">
              Đang lọc
            </span>
            {active.map(({ group, value }) => (
              <Link
                key={group.key}
                href={buildHref(query, { [group.key]: undefined })}
                className="tab-chip tab-chip-active"
                aria-label={`Bỏ lọc ${group.label}: ${value}`}
              >
                {value}
                <CloseIcon className="h-3.5 w-3.5 opacity-70" />
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
