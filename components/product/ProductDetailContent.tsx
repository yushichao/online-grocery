"use client";

import Link from "next/link";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductImage } from "@/components/product/ProductImage";
import { useProducts } from "@/context/ProductContext";
import { getCategoryBySlug } from "@/lib/data/categories";
import { formatPrice } from "@/lib/utils/format";

export function ProductDetailContent({ id }: { id: string }) {
  const { getProduct, isHydrated } = useProducts();
  const product = getProduct(id);

  if (!product) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-xl font-semibold text-stone-900">
          {isHydrated ? "商品未找到" : "正在加载商品..."}
        </h1>
        {isHydrated ? (
          <Link href="/" className="mt-6 inline-block text-sm text-stone-500">
            返回首页
          </Link>
        ) : null}
      </div>
    );
  }

  const category = getCategoryBySlug(product.categorySlug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <nav className="mb-6 text-sm text-stone-500">
        <Link href="/" className="transition-colors hover:text-stone-900">
          首页
        </Link>
        <span className="mx-2">/</span>
        {category ? (
          <>
            <Link
              href={`/category/${category.slug}`}
              className="transition-colors hover:text-stone-900"
            >
              {category.name}
            </Link>
            <span className="mx-2">/</span>
          </>
        ) : null}
        <span className="text-stone-900">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductImage product={product} size="lg" />
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-stone-900 sm:text-3xl">
              {product.name}
            </h1>
            <p className="text-lg text-stone-500">{product.nameJa}</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-semibold text-stone-900">
              {formatPrice(product.price)}
            </p>
            <p className="text-sm text-stone-400">规格：{product.unit}</p>
            <p className="text-sm text-stone-500">库存：{product.stock}</p>
          </div>
          <p className="leading-relaxed text-stone-600">{product.description}</p>
          <div className="mt-auto space-y-4">
            <AddToCartButton product={product} size="lg" fullWidth />
          </div>
        </div>
      </div>
    </div>
  );
}
