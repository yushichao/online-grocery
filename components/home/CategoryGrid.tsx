import Link from "next/link";
import { categories } from "@/lib/data/categories";

export function CategoryGrid() {
  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between">
        <h2 className="text-xl font-semibold text-stone-900">商品分类</h2>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="group flex flex-col items-center gap-3 rounded-3xl bg-white p-5 shadow-[0_2px_24px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_32px_rgba(0,0,0,0.08)]"
          >
            <span className="text-3xl" aria-hidden>
              {category.emoji}
            </span>
            <div className="text-center">
              <p className="text-sm font-semibold text-stone-900">
                {category.name}
              </p>
              <p className="text-xs text-stone-400">{category.nameJa}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
