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
public/uploads      Ảnh do admin tải lên
```

## Dữ liệu sản phẩm

Sản phẩm lưu trong `data/products.json`, đọc và ghi qua `src/lib/products.ts`. Sau mỗi thao tác
trong trang quản trị, các trang công khai được làm mới bằng `revalidatePath`.

Vì dữ liệu và ảnh tải lên nằm trên ổ đĩa, hãy triển khai dưới dạng một Node server có ổ đĩa ghi
được (VPS, Docker, hoặc dịch vụ có persistent volume). Nếu chuyển sang môi trường serverless,
cần thay `src/lib/products.ts` bằng một cơ sở dữ liệu và chuyển ảnh sang dịch vụ lưu trữ ngoài.

## Cấu hình cần cập nhật

- `.env.local` — `ADMIN_PASSWORD`, `ADMIN_SECRET` (bắt buộc đổi trước khi chạy thật) và
  `NEXT_PUBLIC_SITE_URL` (dùng cho sitemap, robots.txt và thẻ Open Graph).
- `src/lib/site.ts` — thông tin công ty, và đường dẫn các kênh mạng xã hội / kênh bán hàng.
  Kênh nào chưa điền đường dẫn sẽ hiển thị mờ ở footer thay vì thành liên kết chết.

## SEO

Thẻ meta và Open Graph khai báo trong `src/app/layout.tsx` cùng `generateMetadata` của từng trang;
`src/app/sitemap.ts` và `src/app/robots.ts` sinh `sitemap.xml` và `robots.txt`. Trang chi tiết sản
phẩm và trang liên hệ có dữ liệu có cấu trúc JSON-LD. Ảnh chia sẻ mặc định là `public/og-image.jpg`.
