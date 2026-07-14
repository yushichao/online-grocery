import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  emptyMessage = "暂无商品",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-[0_2px_24px_rgba(0,0,0,0.06)]">
        <p className="text-stone-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
