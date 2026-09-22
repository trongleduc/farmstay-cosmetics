'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { isAuthenticated, signIn, signOut } from '@/lib/auth';
import {
  createProduct,
  deleteProduct,
  getProductById,
  saveUploadedImages,
  toProductInput,
  updateProduct,
} from '@/lib/products';
import { slugify } from '@/lib/slug';
import type { ProductInput, Spec } from '@/lib/types';

export type FormState = {
  error?: string;
  /** Cảnh báo không chặn việc lưu, ví dụ một ảnh bị bỏ qua vì sai định dạng. */
  notices?: string[];
};

/** Làm mới mọi trang công khai đang đọc dữ liệu sản phẩm. */
function revalidatePublicPages() {
  revalidatePath('/', 'layout');
}

// --- đăng nhập ------------------------------------------------------------

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const password = String(formData.get('password') ?? '');
  const next = String(formData.get('next') ?? '/admin');

  if (!password) return { error: 'Vui lòng nhập mật khẩu.' };
  if (!(await signIn(password))) return { error: 'Mật khẩu không đúng.' };

  redirect(next.startsWith('/admin') ? next : '/admin');
}

export async function logoutAction(): Promise<void> {
  await signOut();
  redirect('/admin/login');
}

// --- sản phẩm -------------------------------------------------------------

function text(formData: FormData, key: string): string {
  return String(formData.get(key) ?? '').replace(/\r\n/g, '\n').trim();
}

function lines(formData: FormData, key: string): string[] {
  return text(formData, key)
    .split('\n')
    .map((line) => line.replace(/^[•·*-]\s*/, '').trim())
    .filter(Boolean);
}

/** Mỗi dòng có dạng "Nhãn | Giá trị". */
function parseSpecs(formData: FormData): Spec[] {
  return lines(formData, 'specs')
    .map((line) => {
      const [label, ...rest] = line.split('|');
      return { label: label.trim(), value: rest.join('|').trim() };
    })
    .filter((spec) => spec.label && spec.value);
}

function parseImages(formData: FormData): string[] {
  const raw = String(formData.get('images') ?? '[]');
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Chỉ chấp nhận đường dẫn nội bộ để không nhúng được ảnh từ nguồn lạ.
    return parsed.filter(
      (item): item is string => typeof item === 'string' && item.startsWith('/'),
    );
  } catch {
    return [];
  }
}

async function readForm(formData: FormData): Promise<
  { ok: true; input: ProductInput; notices: string[] } | { ok: false; error: string }
> {
  const name = text(formData, 'name');
  if (!name) return { ok: false, error: 'Tên sản phẩm không được để trống.' };

  const slug = slugify(text(formData, 'slug') || name.replace(/^farmstay\s*/i, ''));
  if (!slug) return { ok: false, error: 'Đường dẫn không hợp lệ, vui lòng nhập lại.' };

  const priceRaw = text(formData, 'price').replace(/[^0-9.]/g, '');
  const price = Number.parseFloat(priceRaw);
  if (!Number.isFinite(price) || price < 0) {
    return { ok: false, error: 'Giá bán phải là một số hợp lệ.' };
  }

  const files = formData.getAll('newImages').filter((item): item is File => item instanceof File);
  const uploaded = await saveUploadedImages(files, slug);

  return {
    ok: true,
    notices: uploaded.errors,
    input: {
      name,
      slug,
      line: text(formData, 'line').toUpperCase(),
      category: text(formData, 'category').toUpperCase(),
      concern: text(formData, 'concern').toUpperCase(),
      intro: text(formData, 'intro'),
      benefits: lines(formData, 'benefits'),
      overview: text(formData, 'overview'),
      specs: parseSpecs(formData),
      ingredients: text(formData, 'ingredients'),
      usage: text(formData, 'usage'),
      caution: text(formData, 'caution'),
      price,
      images: [...parseImages(formData), ...uploaded.urls],
      featured: formData.get('featured') === 'on',
      order: Number.parseInt(text(formData, 'order'), 10) || 0,
    },
  };
}

export async function saveProductAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await isAuthenticated())) return { error: 'Phiên đăng nhập đã hết hạn.' };

  const parsed = await readForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  const id = String(formData.get('id') ?? '');

  if (id) {
    const updated = await updateProduct(id, parsed.input);
    if (!updated) return { error: 'Không tìm thấy sản phẩm cần cập nhật.' };
  } else {
    await createProduct(parsed.input);
  }

  revalidatePublicPages();
  redirect(`/admin?trang-thai=${id ? 'da-cap-nhat' : 'da-them'}`);
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) redirect('/admin/login');

  const id = String(formData.get('id') ?? '');
  if (id) await deleteProduct(id);

  revalidatePublicPages();
  redirect('/admin?trang-thai=da-xoa');
}

export async function toggleFeaturedAction(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) redirect('/admin/login');

  const id = String(formData.get('id') ?? '');
  const product = await getProductById(id);
  if (!product) redirect('/admin');

  await updateProduct(id, { ...toProductInput(product), featured: !product.featured });

  revalidatePublicPages();
  redirect('/admin');
}
