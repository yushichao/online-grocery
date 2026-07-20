"use client";

import { ProductGrid } from "@/components/product/ProductGrid";
import { useProducts } from "@/context/ProductContext";
import type { CategorySlug } from "@/lib/types";

export function CategoryProducts({ slug }: { slug: CategorySlug }) {
  const { products } = useProducts();
  return (
    <ProductGrid
      products={products.filter((product) => product.categorySlug === slug)}
    />
  );
}
