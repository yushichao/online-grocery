import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductImage } from "@/components/product/ProductImage";
import { getCategoryBySlug } from "@/lib/data/categories";
import { getProductById } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils/format";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const { products } = await import("@/lib/data/products");
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return { title: "商品未找到" };
  }

  return {
    title: `${product.name} | SHOW LIFE`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
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
            {product.promotion ? (
              <p className="inline-block rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
                {product.promotion}
              </p>
            ) : null}
          </div>

          <p className="leading-relaxed text-stone-600">{product.description}</p>

          <div className="mt-auto space-y-4">
            <AddToCartButton product={product} size="lg" fullWidth />
            <p className="text-center text-xs text-stone-400">
              下单后当日配送 · 满 ¥3,000 免配送费
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
