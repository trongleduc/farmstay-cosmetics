import { promises as fs } from 'node:fs';
import path from 'node:path';

import { taxonomyGroups, type TaxonomyKey } from '@/lib/taxonomy';
import type { Product, ProductInput } from '@/lib/types';

/**
 * Kho dữ liệu sản phẩm dạng file JSON (`data/products.json`).
 * Đủ cho quy mô danh mục hiện tại và không cần cài thêm cơ sở dữ liệu.
 * Chỉ được import từ Server Component, Server Action hoặc Route Handler.
 */

const DATA_FILE = path.join(process.cwd(), 'data', 'products.json');
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

/** Nối các lần ghi lại thành hàng đợi để hai request không ghi đè nhau. */
let writeQueue: Promise<unknown> = Promise.resolve();

function enqueue<T>(job: () => Promise<T>): Promise<T> {
  const run = writeQueue.then(job, job);
  writeQueue = run.catch(() => undefined);
  return run;
}

function sortProducts(products: Product[]): Product[] {
  return [...products].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, 'vi'));
}

async function readFile(): Promise<Product[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Product[]) : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
}

async function writeFile(products: Product[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(sortProducts(products), null, 2) + '\n', 'utf8');
}

export async function getProducts(): Promise<Product[]> {
  return sortProducts(await readFile());
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return (await readFile()).find((p) => p.slug === slug);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  return (await readFile()).find((p) => p.id === id);
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

    return { key: group.key, label: group.label, options };
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

export async function createProduct(input: ProductInput): Promise<Product> {
  return enqueue(async () => {
    const products = await readFile();
    const product: Product = {
      ...input,
      id: nextId(products),
      slug: uniqueSlug(products, input.slug),
      order: input.order || products.length + 1,
      updatedAt: new Date().toISOString(),
    };
    await writeFile([...products, product]);
    return product;
  });
}

export async function updateProduct(id: string, input: ProductInput): Promise<Product | null> {
  return enqueue(async () => {
    const products = await readFile();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const product: Product = {
      ...input,
      id,
      slug: uniqueSlug(products, input.slug, id),
      updatedAt: new Date().toISOString(),
    };
    products[index] = product;
    await writeFile(products);
    return product;
  });
}

export async function deleteProduct(id: string): Promise<boolean> {
  return enqueue(async () => {
    const products = await readFile();
    const next = products.filter((p) => p.id !== id);
    if (next.length === products.length) return false;
    await writeFile(next);
    return true;
  });
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
 * Lưu ảnh admin tải lên vào `public/uploads` và trả về đường dẫn công khai.
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
    const dir = path.join(UPLOAD_DIR, safeSlug);
    await fs.mkdir(dir, { recursive: true });
    const name = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
    urls.push(`/uploads/${safeSlug}/${name}`);
  }

  return { urls, errors };
}
