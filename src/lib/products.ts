import { cache } from 'react';

import { productsCollection } from '@/lib/db';
import { uploadObject } from '@/lib/storage';
import { taxonomyGroups, type TaxonomyKey } from '@/lib/taxonomy';
import type { Product, ProductInput } from '@/lib/types';

/**
 * Kho dữ liệu sản phẩm trên MongoDB (collection `products`), ảnh lưu trên R2.
 * Dữ liệu ban đầu nạp từ `data/products.json` bằng `npm run db:seed`.
 * Chỉ được import từ Server Component, Server Action hoặc Route Handler.
 */

/** Bỏ `_id` nội bộ của MongoDB; site chỉ dùng trường `id` riêng. */
const PROJECTION = { projection: { _id: 0 } } as const;

function sortProducts(products: Product[]): Product[] {
  return [...products].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, 'vi'));
}

async function readAll(): Promise<Product[]> {
  const collection = await productsCollection();
  return collection.find({}, PROJECTION).toArray();
}

/**
 * Danh mục đầy đủ, đã sắp xếp. Bọc `cache` để các hàm khác gọi lại trong cùng
 * một lần dựng trang (facet, taxonomy, sản phẩm liên quan) chỉ tốn một truy vấn.
 */
export const getProducts = cache(async (): Promise<Product[]> => sortProducts(await readAll()));

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const collection = await productsCollection();
  return (await collection.findOne({ slug }, PROJECTION)) ?? undefined;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const collection = await productsCollection();
  return (await collection.findOne({ id }, PROJECTION)) ?? undefined;
}

export async function getFeaturedProducts(limit = 5): Promise<Product[]> {
  const products = await getProducts();
  const featured = products.filter((p) => p.featured);
  return (featured.length ? featured : products).slice(0, limit);
}

/** Sản phẩm cùng dòng hoặc cùng phân loại, dùng cho mục "Có thể bạn quan tâm". */
export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const products = (await getProducts()).filter((p) => p.id !== product.id);
  const score = (p: Product) =>
    (p.line && p.line === product.line ? 2 : 0) +
    (p.category === product.category ? 1 : 0) +
    (p.concern === product.concern ? 1 : 0);
  return products
    .map((p) => ({ p, s: score(p) }))
    .sort((a, b) => b.s - a.s || a.p.order - b.p.order)
    .slice(0, limit)
    .map((x) => x.p);
}

export type Facet = { value: string; count: number };

export type Facets = {
  lines: Facet[];
  categories: Facet[];
  concerns: Facet[];
};

function countBy(products: Product[], key: 'line' | 'category' | 'concern'): Facet[] {
  const counts = new Map<string, number>();
  for (const product of products) {
    const value = product[key];
    if (!value) continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value, 'vi'));
}

export type TaxonomyOption = { value: string; count: number };

export type TaxonomyGroup = {
  key: TaxonomyKey;
  label: string;
  /** Nhãn rút gọn cho nút lọc trên màn hình hẹp. */
  short: string;
  options: TaxonomyOption[];
};

/**
 * Danh mục đầy đủ kèm số sản phẩm của từng mục.
 *
 * Luôn trả về đủ các mục khai báo trong `lib/taxonomy.ts` (mục chưa có sản phẩm
 * thì count = 0). Giá trị có trong dữ liệu nhưng chưa được khai báo vẫn được
 * thêm vào cuối, để không sản phẩm nào bị lọt khỏi bộ lọc.
 */
export async function getTaxonomy(): Promise<TaxonomyGroup[]> {
  const products = await getProducts();

  return taxonomyGroups.map((group) => {
    const counts = new Map<string, number>();
    for (const product of products) {
      const value = product[group.key];
      if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
    }

    const declared = group.values as readonly string[];
    const options: TaxonomyOption[] = declared.map((value) => ({
      value,
      count: counts.get(value) ?? 0,
    }));

    for (const [value, count] of counts) {
      if (!declared.includes(value)) options.push({ value, count });
    }

    return { key: group.key, label: group.label, short: group.short, options };
  });
}

export async function getFacets(): Promise<Facets> {
  const products = await getProducts();
  return {
    lines: countBy(products, 'line'),
    categories: countBy(products, 'category'),
    concerns: countBy(products, 'concern'),
  };
}

// --- ghi dữ liệu ----------------------------------------------------------

function nextId(products: Product[]): string {
  const max = products.reduce((acc, p) => {
    const n = Number.parseInt(p.id.replace(/\D/g, ''), 10);
    return Number.isFinite(n) ? Math.max(acc, n) : acc;
  }, 0);
  return 'p' + String(max + 1).padStart(2, '0');
}

function uniqueSlug(products: Product[], slug: string, ignoreId?: string): string {
  const taken = new Set(products.filter((p) => p.id !== ignoreId).map((p) => p.slug));
  if (!taken.has(slug)) return slug;
  let i = 2;
  while (taken.has(`${slug}-${i}`)) i += 1;
  return `${slug}-${i}`;
}

/** Lấy phần dữ liệu có thể chỉnh sửa của một sản phẩm, bỏ id và mốc cập nhật. */
export function toProductInput(product: Product): ProductInput {
  return {
    slug: product.slug,
    name: product.name,
    line: product.line,
    category: product.category,
    concern: product.concern,
    intro: product.intro,
    benefits: product.benefits,
    overview: product.overview,
    specs: product.specs,
    ingredients: product.ingredients,
    usage: product.usage,
    caution: product.caution,
    price: product.price,
    images: product.images,
    featured: product.featured,
    order: product.order,
  };
}

/** Lỗi trùng khóa của MongoDB, xảy ra khi hai request cùng lấy một id hoặc đường dẫn. */
function isDuplicateKey(error: unknown): boolean {
  return (error as { code?: number } | null)?.code === 11000;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const collection = await productsCollection();

  // id và đường dẫn được tính từ dữ liệu hiện có; nếu request khác vừa chiếm
  // mất thì chỉ mục duy nhất báo lỗi và ta tính lại.
  for (let attempt = 0; ; attempt += 1) {
    const products = await readAll();
    const product: Product = {
      ...input,
      id: nextId(products),
      slug: uniqueSlug(products, input.slug),
      order: input.order || products.length + 1,
      updatedAt: new Date().toISOString(),
    };
    try {
      // Chép ra object mới vì insertOne gắn thêm `_id` vào chính object được truyền vào.
      await collection.insertOne({ ...product });
      return product;
    } catch (error) {
      if (!isDuplicateKey(error) || attempt >= 4) throw error;
    }
  }
}

export async function updateProduct(id: string, input: ProductInput): Promise<Product | null> {
  const collection = await productsCollection();
  const existing = await collection.findOne({ id }, PROJECTION);
  if (!existing) return null;

  const products = await readAll();
  const product: Product = {
    ...input,
    id,
    slug: uniqueSlug(products, input.slug, id),
    updatedAt: new Date().toISOString(),
  };
  const result = await collection.replaceOne({ id }, product);
  return result.matchedCount ? product : null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const collection = await productsCollection();
  const result = await collection.deleteOne({ id });
  return result.deletedCount === 1;
}

// --- ảnh tải lên ----------------------------------------------------------

const ALLOWED_IMAGE_TYPES = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/avif', '.avif'],
]);

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export type UploadResult = { urls: string[]; errors: string[] };

/**
 * Tải ảnh admin chọn lên R2 (thư mục `uploads/<slug>/`) và trả về đường dẫn công khai.
 * Tên file do server đặt nên tên gốc của người dùng không ảnh hưởng đến đường dẫn.
 */
export async function saveUploadedImages(files: File[], slug: string): Promise<UploadResult> {
  const urls: string[] = [];
  const errors: string[] = [];
  const safeSlug = slug.replace(/[^a-z0-9-]/g, '') || 'product';

  for (const file of files) {
    if (!file || file.size === 0) continue;
    const ext = ALLOWED_IMAGE_TYPES.get(file.type);
    if (!ext) {
      errors.push(`${file.name}: chỉ nhận ảnh JPG, PNG, WEBP hoặc AVIF.`);
      continue;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      errors.push(`${file.name}: ảnh vượt quá 8MB.`);
      continue;
    }
    const name = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    try {
      const body = new Uint8Array(await file.arrayBuffer());
      urls.push(await uploadObject(`uploads/${safeSlug}/${name}`, body, file.type));
    } catch (error) {
      console.error('Tải ảnh lên R2 thất bại:', error);
      errors.push(`${file.name}: không tải lên được, vui lòng thử lại.`);
    }
  }

  return { urls, errors };
}
