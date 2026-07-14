import Link from "next/link";
import { CartLink } from "@/components/layout/CartLink";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-[#FAFAF8]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex flex-col">
          <span className="text-lg font-semibold tracking-tight text-stone-900">
            SHOW LIFE
          </span>
          <span className="text-xs text-stone-500">中华食材宅配</span>
        </Link>
        {/* <nav className="hidden items-center gap-8 text-sm text-stone-600 sm:flex">
          <Link href="/" className="transition-colors hover:text-stone-900">
            首页
          </Link>
          <Link
            href="/category/vegetables"
            className="transition-colors hover:text-stone-900"
          >
            商品分类
          </Link>
        </nav> */}
        <CartLink />
      </div>
    </header>
  );
}
