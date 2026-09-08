import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "নাগরিক সেবা - Nagarik Sheba",
  description:
    "বাংলাদেশের নাগরিক সেবা প্ল্যাটফর্ম। NID, স্মার্টকার্ড, TIN সহ ৪২টিরও বেশি সরকারি সেবা এক জায়গায়।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>

      <body>{children}</body>
    </html>
  );
}