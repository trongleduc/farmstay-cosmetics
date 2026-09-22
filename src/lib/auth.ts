import crypto from 'node:crypto';
import { cookies } from 'next/headers';

/**
 * Phiên đăng nhập admin: một cookie httpOnly được ký HMAC.
 * Mật khẩu và khóa ký đọc từ biến môi trường (xem `.env.example`).
 */

export const SESSION_COOKIE = 'farmstay_admin';
const MAX_AGE_SECONDS = 60 * 60 * 8;

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || 'farmstay@2026';
}

function secret(): string {
  return process.env.ADMIN_SECRET || 'doi-chuoi-nay-truoc-khi-chay-that';
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', secret()).update(payload).digest('hex');
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function createToken(): string {
  const expiresAt = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = `admin.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [role, expiresAt, signature] = parts;
  const payload = `${role}.${expiresAt}`;
  if (!safeEqual(signature, sign(payload))) return false;
  return Number(expiresAt) > Date.now();
}

/** Kiểm tra mật khẩu và mở phiên. Trả về false nếu sai mật khẩu. */
export async function signIn(password: string): Promise<boolean> {
  const expected = adminPassword();
  if (!password || !safeEqual(password, expected)) return false;

  const store = await cookies();
  store.set(SESSION_COOKIE, createToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });
  return true;
}

export async function signOut(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/**
 * Nguồn sự thật duy nhất cho quyền admin.
 * Gọi trong layout admin và trong mọi Server Action — Server Action có thể bị
 * gọi thẳng bằng POST nên không thể chỉ dựa vào việc đã chặn ở proxy.
 */
export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(SESSION_COOKIE)?.value);
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAuthenticated())) {
    throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
  }
}
