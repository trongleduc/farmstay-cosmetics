# Farmstay Việt Nam — Website thương hiệu

Website giới thiệu thương hiệu và danh mục sản phẩm chăm sóc da Farmstay, kèm khu quản trị
sản phẩm. Xây dựng bằng Next.js 16 (App Router), React 19 và Tailwind CSS v4.

## Chạy dự án

```bash
npm install
cp .env.example .env.local   # rồi sửa mật khẩu và khóa ký
npm run dev                  # http://localhost:3000
```

Các lệnh khác:

```bash
npm run build   # build production (đồng thời kiểm tra TypeScript)
npm run start   # chạy bản build production
npm run lint    # ESLint
```

## Cấu trúc

| Đường dẫn | Nội dung |
| --- | --- |
| `/` | Trang chủ: hero, giới thiệu, giá trị cốt lõi, sản phẩm nổi bật, câu chuyện thương hiệu |
| `/gioi-thieu` | Thông tin công ty, lịch sử, tầm nhìn, sứ mệnh, brand story, hệ sinh thái sản phẩm |
| `/san-pham` | Danh mục, lọc theo dòng sản phẩm / phân loại / vấn đề da, tìm kiếm, sắp xếp |
| `/san-pham/[slug]` | Chi tiết sản phẩm: ảnh, công dụng, thông số, thành phần, hướng dẫn, lưu ý |
| `/lien-he` | Thông tin liên hệ, doanh nghiệp và bản đồ Google Maps |
| `/admin` | Quản trị sản phẩm (thêm, sửa, xóa, đánh dấu nổi bật, quản lý ảnh) |

Mã nguồn:

```
src/app/(site)      Các trang công khai, dùng chung header và footer
src/app/admin       Khu quản trị và các Server Action
src/components      Component giao diện dùng lại
src/lib             Dữ liệu, cấu hình site, xác thực, tiện ích
src/proxy.ts        Chặn sớm /admin khi chưa đăng nhập
data/products.json  Dữ liệu sản phẩm
public/products     Ảnh sản phẩm ban đầu
scripts/seed.mjs    Nạp dữ liệu ban đầu vào MongoDB và R2
```

## Dữ liệu sản phẩm

Sản phẩm lưu trên MongoDB (collection `products`), ảnh sản phẩm lưu trên Cloudflare R2. Toàn bộ
việc đọc và ghi đi qua `src/lib/products.ts`. Sau mỗi thao tác trong trang quản trị, các trang
công khai được làm mới bằng `revalidatePath`.

`data/products.json` chỉ còn là dữ liệu ban đầu. Nạp vào database và đẩy ảnh lên R2 bằng:

```bash
npm run db:seed              # chỉ thêm sản phẩm chưa có, không đụng vào sản phẩm đã sửa
npm run db:seed -- --force   # ghi đè toàn bộ bằng dữ liệu trong file
```

`npm run build` đọc dữ liệu thật từ MongoDB để dựng sẵn trang, nên môi trường build cũng cần
đủ biến `MONGODB_*` và `R2_*`.

## Cấu hình cần cập nhật

- `.env.local` — `ADMIN_PASSWORD`, `ADMIN_SECRET` (bắt buộc đổi trước khi chạy thật),
  `NEXT_PUBLIC_SITE_URL` (dùng cho sitemap, robots.txt và thẻ Open Graph), `MONGODB_URI`,
  `MONGODB_DB` và các biến `R2_*`. Chỉ điền giá trị thật vào `.env.local`; `.env.example` được
  commit lên git nên chỉ để trống.
- `src/lib/site.ts` — thông tin công ty, và đường dẫn các kênh mạng xã hội / kênh bán hàng.
  Kênh nào chưa điền đường dẫn sẽ hiển thị mờ ở footer thay vì thành liên kết chết.

## SEO

Thẻ meta và Open Graph khai báo trong `src/app/layout.tsx` cùng `generateMetadata` của từng trang;
`src/app/sitemap.ts` và `src/app/robots.ts` sinh `sitemap.xml` và `robots.txt`. Trang chi tiết sản
phẩm và trang liên hệ có dữ liệu có cấu trúc JSON-LD. Ảnh chia sẻ mặc định là `public/og-image.jpg`.
