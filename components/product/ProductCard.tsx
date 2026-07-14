import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils/format";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductImage } from "@/components/product/ProductImage";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_2px_24px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_4px_32px_rgba(0,0,0,0.08)]">
      <ProductImage product={product} size="md" linkToDetail />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="space-y-1">
          <Link href={`/product/${product.id}`}>
            <h3 className="text-base font-semibold text-stone-900 transition-colors group-hover:text-stone-700">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-stone-500">{product.nameJa}</p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-stone-900">
              {formatPrice(product.price)}
            </p>
            <p className="text-xs text-stone-400">{product.unit}</p>
          </div>
          <AddToCartButton product={product} size="sm" />
        </div>
      </div>
    </article>
  );
}
