import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getCategoryBySlug } from "@/lib/data/categories";
import { getProductsByCategory } from "@/lib/data/products";
import type { CategorySlug } from "@/lib/types";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [
    { slug: "vegetables" },
    { slug: "frozen-food" },
    { slug: "snacks" },
    { slug: "drinks" },
    { slug: "instant-noodles" },
    { slug: "seasonings" },
  ];
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return { title: "分类未找到" };
  }

  return {
    title: `${category.name} | SHOW LIFE`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = getProductsByCategory(category.slug as CategorySlug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <nav className="mb-6 text-sm text-stone-500">
        <Link href="/" className="transition-colors hover:text-stone-900">
          首页
        </Link>
        <span className="mx-2">/</span>
        <span className="text-stone-900">{category.name}</span>
      </nav>

      <header className="mb-10 space-y-3">
        <div className="flex items-center gap-4">
          <span className="text-4xl" aria-hidden>
            {category.emoji}
          </span>
          <div>
            <h1 className="text-2xl font-semibold text-stone-900 sm:text-3xl">
              {category.name}
            </h1>
            <p className="text-stone-500">{category.nameJa}</p>
          </div>
        </div>
        <p className="max-w-xl text-sm leading-relaxed text-stone-600">
          {category.description}
        </p>
      </header>

      <ProductGrid products={products} />
    </div>
  );
}
