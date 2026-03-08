import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tạo Link Shopee",
  description: "Tạo link affiliate Shopee - miki.shpee.cc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
