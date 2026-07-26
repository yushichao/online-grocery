"use client";

import { ProductGrid } from "@/components/product/ProductGrid";
import { useProducts } from "@/context/ProductContext";

export function PopularProductList() {
  const { products } = useProducts();

  return (
    <ProductGrid
      products={products.filter((product) => product.popular)}
      emptyMessage="暂无人气商品"
    />
  );
}
