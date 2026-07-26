import Link from "next/link";
import { PopularProductList } from "@/components/product/PopularProductList";

export const metadata = {
  title: "人气商品 | SHOW LIFE",
  description: "浏览 SHOW LIFE 的人气中华食材与热销商品。",
};

export default function PopularProductsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <nav className="mb-6 text-sm text-stone-500">
        <Link href="/" className="transition-colors hover:text-stone-900">
          首页
        </Link>
        <span className="mx-2">/</span>
        <span className="text-stone-900">人气商品</span>
      </nav>

      <header className="mb-10 space-y-3">
        <h1 className="text-2xl font-semibold text-stone-900 sm:text-3xl">
          人气商品
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-stone-600">
          精选大家喜爱的热销中华食材。
        </p>
      </header>

      <PopularProductList />
    </div>
  );
}
