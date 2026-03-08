# Affiliate Link Generator

Frontend đơn giản: nhập **URL** và **Affiliate ID** → gọi API và hiển thị **affiliate_link**.

## Chạy local

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Deploy lên Vercel

1. Đẩy code lên GitHub (hoặc GitLab/Bitbucket).
2. Vào [vercel.com](https://vercel.com) → **Add New** → **Project** → import repo.
3. Giữ nguyên framework preset **Next.js** → **Deploy**.

Hoặc dùng Vercel CLI:

```bash
npm i -g vercel
vercel
```

Sau khi deploy, truy cập URL Vercel và dùng form như bình thường.
