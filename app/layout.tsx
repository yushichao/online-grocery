import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Sans_SC } from "next/font/google";
import { SiteLayout } from "@/components/layout/SiteLayout";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SHOW LIFE | 中华食材宅配",
  description:
    "专为在日华人家庭提供新鲜蔬菜、零食、调味料等中华食材的宅配服务。东京圈内当日送达。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh"
      className={`${notoSansJP.variable} ${notoSansSC.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#FAFAF8] font-sans text-stone-900">
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
