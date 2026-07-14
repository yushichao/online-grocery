import Link from "next/link";
import type { Product } from "@/lib/types";
import { ProductGrid } from "@/components/product/ProductGrid";

interface PopularProductsProps {
  products: Product[];
}

export function PopularProducts({ products }: PopularProductsProps) {
  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between">
        <h2 className="text-xl font-semibold text-stone-900">人气商品</h2>
        <Link
          href="/category/snacks"
          className="text-sm text-stone-500 transition-colors hover:text-stone-900"
        >
          查看更多
        </Link>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
