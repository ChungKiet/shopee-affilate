# Tạo Link Shopee

Frontend đơn giản: dán **link sản phẩm Shopee** → tạo link affiliate (Affiliate ID cấu hình qua env, không nhập trên form).

## Cấu hình

1. Copy file env mẫu:
   ```bash
   cp .env.example .env.local
   ```
2. Sửa `.env.local`: đặt `AFFILIATE_ID` (ví dụ: `17360460223`).
3. (Tùy chọn) Đặt `NEXT_PUBLIC_FACEBOOK_POST_URL` cho nút "Đến bài đăng Facebook".

## Chạy local

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Deploy lên Vercel

1. Đẩy code lên GitHub (hoặc GitLab/Bitbucket).
2. Vào [vercel.com](https://vercel.com) → **Add New** → **Project** → import repo.
3. Trong **Environment Variables** của project, thêm:
   - `AFFILIATE_ID` = ID affiliate của bạn (bắt buộc).
   - `NEXT_PUBLIC_FACEBOOK_POST_URL` = link bài đăng Facebook (tùy chọn).
4. Deploy. Framework preset **Next.js** được nhận tự động.

Hoặc dùng Vercel CLI:

```bash
npm i -g vercel
vercel
```

Sau khi deploy, nhớ cấu hình `AFFILIATE_ID` trong Settings → Environment Variables trên Vercel.
