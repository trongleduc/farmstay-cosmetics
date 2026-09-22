'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { saveProductAction, type FormState } from '@/app/admin/actions';
import { slugify } from '@/lib/slug';
import type { Product } from '@/lib/types';

type Suggestions = {
  lines: string[];
  categories: string[];
  concerns: string[];
};

type ProductFormProps = {
  product?: Product;
  suggestions: Suggestions;
};

const inputClass =
  'field';

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[0.625rem] font-semibold tracking-[0.18em] text-muted uppercase">
        {label}
      </span>
      {hint ? <span className="mt-1 block text-xs text-muted">{hint}</span> : null}
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-6 md:p-7">
      <h2 className="font-display text-xl text-ink">{title}</h2>
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}

function Datalist({ id, options }: { id: string; options: string[] }) {
  if (!options.length) return null;
  return (
    <datalist id={id}>
      {options.map((option) => (
        <option key={option} value={option} />
      ))}
    </datalist>
  );
}

/** Quản lý thứ tự và việc gỡ ảnh đã lưu; ảnh mới được thêm sau khi tải lên. */
function ImageManager({ images, setImages }: { images: string[]; setImages: (next: string[]) => void }) {
  const move = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setImages(next);
  };

  return (
    <div>
      <input type="hidden" name="images" value={JSON.stringify(images)} />

      {images.length ? (
        <ul className="grid grid-cols-3 gap-3">
          {images.map((image, index) => (
            <li key={image} className="rounded-xl border border-line bg-white p-2">
              <div className="relative aspect-square bg-white">
                <Image src={image} alt="" fill sizes="8rem" className="object-contain" />
              </div>
              <p className="mt-2 text-center text-[0.5625rem] tracking-[0.12em] text-muted uppercase">
                {index === 0 ? 'Ảnh chính' : `Ảnh ${index + 1}`}
              </p>
              <div className="mt-1 flex items-center justify-between gap-1 text-xs">
                <span className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, index - 1)}
                    disabled={index === 0}
                    aria-label="Chuyển lên trước"
                    className="px-1.5 py-0.5 text-muted transition-colors hover:text-ink disabled:opacity-30"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, index + 1)}
                    disabled={index === images.length - 1}
                    aria-label="Chuyển ra sau"
                    className="px-1.5 py-0.5 text-muted transition-colors hover:text-ink disabled:opacity-30"
                  >
                    →
                  </button>
                </span>
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== index))}
                  className="px-1.5 py-0.5 text-muted transition-colors hover:text-accent"
                >
                  Gỡ
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="border border-dashed border-line px-4 py-8 text-center text-sm text-muted">
          Chưa có ảnh nào. Ảnh đầu tiên trong danh sách sẽ là ảnh chính.
        </p>
      )}
    </div>
  );
}

function SubmitBar({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();

  return (
    <div className="sticky bottom-0 -mx-5 mt-10 border-t border-line bg-cream/95 px-5 py-4 backdrop-blur md:-mx-8 md:px-8">
      <div className="flex flex-wrap items-center justify-end gap-5">
        <Link href="/admin" className="text-sm text-muted transition-colors hover:text-ink">
          Hủy
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="btn disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
        </button>
      </div>
    </div>
  );
}

export function ProductForm({ product, suggestions }: ProductFormProps) {
  const [state, formAction] = useActionState<FormState, FormData>(saveProductAction, {});
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [slug, setSlug] = useState(product?.slug ?? '');

  return (
    <form action={formAction}>
      {product ? <input type="hidden" name="id" value={product.id} /> : null}

      {state.error ? (
        <p role="alert" className="mb-8 border-l-2 border-accent bg-white px-5 py-4 text-sm text-ink">
          {state.error}
        </p>
      ) : null}

      {state.notices?.length ? (
        <ul className="mb-8 rounded-xl border border-line bg-white px-5 py-4 text-sm text-ink-soft">
          {state.notices.map((notice) => (
            <li key={notice}>{notice}</li>
          ))}
        </ul>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="space-y-6 lg:col-span-8">
          <Panel title="Thông tin cơ bản">
            <Field label="Tên sản phẩm">
              <input
                name="name"
                required
                defaultValue={product?.name ?? ''}
                onBlur={(event) => {
                  if (!slug) setSlug(slugify(event.target.value.replace(/^farmstay\s*/i, '')));
                }}
                className={inputClass}
              />
            </Field>

            <Field label="Đường dẫn" hint="Phần sau /products/. Để trống sẽ tự tạo từ tên.">
              <input
                name="slug"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Mô tả ngắn" hint="Câu giới thiệu hiển thị ở thẻ sản phẩm và đầu trang chi tiết.">
              <textarea
                name="intro"
                rows={3}
                defaultValue={product?.intro ?? ''}
                className={inputClass}
              />
            </Field>

            <Field label="Công dụng" hint="Mỗi dòng là một gạch đầu dòng.">
              <textarea
                name="benefits"
                rows={5}
                defaultValue={product?.benefits.join('\n') ?? ''}
                className={inputClass}
              />
            </Field>

            <Field label="Mô tả chi tiết">
              <textarea
                name="overview"
                rows={6}
                defaultValue={product?.overview ?? ''}
                className={inputClass}
              />
            </Field>
          </Panel>

          <Panel title="Thông tin sản phẩm">
            <Field label="Thông số" hint="Mỗi dòng một mục, viết theo dạng: Nhãn | Giá trị">
              <textarea
                name="specs"
                rows={8}
                defaultValue={
                  product?.specs.map((spec) => `${spec.label} | ${spec.value}`).join('\n') ?? ''
                }
                className={`${inputClass} font-mono text-xs`}
              />
            </Field>

            <Field label="Thành phần">
              <textarea
                name="ingredients"
                rows={6}
                defaultValue={product?.ingredients ?? ''}
                className={inputClass}
              />
            </Field>

            <Field label="Hướng dẫn sử dụng">
              <textarea
                name="usage"
                rows={4}
                defaultValue={product?.usage ?? ''}
                className={inputClass}
              />
            </Field>

            <Field label="Lưu ý khi sử dụng" hint="Mỗi dòng là một lưu ý.">
              <textarea
                name="caution"
                rows={5}
                defaultValue={product?.caution ?? ''}
                className={inputClass}
              />
            </Field>
          </Panel>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <Panel title="Phân loại">
            <Field label="Dòng sản phẩm">
              <input
                name="line"
                list="suggest-line"
                defaultValue={product?.line ?? ''}
                className={inputClass}
              />
              <Datalist id="suggest-line" options={suggestions.lines} />
            </Field>

            <Field label="Phân loại">
              <input
                name="category"
                list="suggest-category"
                defaultValue={product?.category ?? ''}
                className={inputClass}
              />
              <Datalist id="suggest-category" options={suggestions.categories} />
            </Field>

            <Field label="Vấn đề da">
              <input
                name="concern"
                list="suggest-concern"
                defaultValue={product?.concern ?? ''}
                className={inputClass}
              />
              <Datalist id="suggest-concern" options={suggestions.concerns} />
            </Field>
          </Panel>

          <Panel title="Giá và hiển thị">
            <Field label="Giá bán (USD)">
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                required
                defaultValue={product?.price ?? ''}
                className={inputClass}
              />
            </Field>

            <Field label="Thứ tự hiển thị" hint="Số nhỏ đứng trước trong danh mục.">
              <input
                name="order"
                type="number"
                min="0"
                defaultValue={product?.order ?? ''}
                className={inputClass}
              />
            </Field>

            <label className="flex items-start gap-3 rounded-xl border border-line px-4 py-3">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={product?.featured ?? false}
                className="mt-1 h-4 w-4 accent-[#96784c]"
              />
              <span>
                <span className="block text-sm text-ink">Sản phẩm nổi bật</span>
                <span className="mt-1 block text-xs text-muted">
                  Hiển thị trong khối “Sản phẩm nổi bật” ở trang chủ.
                </span>
              </span>
            </label>
          </Panel>

          <Panel title="Hình ảnh">
            <ImageManager images={images} setImages={setImages} />

            <Field label="Thêm ảnh" hint="Chấp nhận JPG, PNG, WEBP, AVIF. Tối đa 8MB mỗi ảnh.">
              <input
                type="file"
                name="newImages"
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple
                className="field text-ink-soft file:mr-4 file:rounded-full file:border-0 file:bg-cream file:px-3 file:py-1.5 file:text-xs file:text-ink"
              />
            </Field>
          </Panel>
        </div>
      </div>

      <SubmitBar isEdit={Boolean(product)} />
    </form>
  );
}
