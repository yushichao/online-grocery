import Link from "next/link";
import { categories } from "@/lib/data/categories";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-stone-900">
              SHOW LIFE
            </h2>
            <p className="max-w-xs text-sm leading-relaxed text-stone-500">
              专为在日华人家庭提供新鲜食材与家乡味道的宅配服务。东京圈内当日送达。
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-stone-900">商品分类</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-sm text-stone-500 transition-colors hover:text-stone-900"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-stone-900">配送信息</h3>
            <ul className="space-y-2 text-sm text-stone-500">
              <li>配送范围：东京23区</li>
              <li>配送时间：10:00 – 20:00</li>
              <li>顾客下单后由后台统一处理</li>
              <li>客服电话：03-XXXX-XXXX</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-stone-100 pt-6 text-center text-xs text-stone-400">
          © 2026 SHOW LIFE. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
