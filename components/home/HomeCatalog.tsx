"use client";

import { CategoryGrid } from "@/components/home/CategoryGrid";
import { PopularProducts } from "@/components/home/PopularProducts";
import { ProductGrid } from "@/components/product/ProductGrid";
import { useProducts } from "@/context/ProductContext";

export function HomeCatalog({ query }: { query: string }) {
  const { products } = useProducts();
  const normalizedQuery = query.toLowerCase();
  const searchResults = normalizedQuery
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(normalizedQuery) ||
          product.nameJa.toLowerCase().includes(normalizedQuery) ||
          product.description.toLowerCase().includes(normalizedQuery),
      )
    : [];

  if (query) {
    return (
      <section className="space-y-5">
        <h2 className="text-xl font-semibold text-stone-900">
          搜索结果：「{query}」
        </h2>
        <ProductGrid
          products={searchResults}
          emptyMessage={`未找到与「${query}」相关的商品`}
        />
      </section>
    );
  }

  return (
    <>
      <CategoryGrid />
      <PopularProducts products={products.filter((product) => product.popular)} />
    </>
  );
}
