import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HeroBanner } from "@/components/home/HeroBanner";
import { PopularProducts } from "@/components/home/PopularProducts";
import { PromotionBanner } from "@/components/home/PromotionBanner";
import { SearchBar } from "@/components/home/SearchBar";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getPopularProducts, searchProducts } from "@/lib/data/products";

interface HomePageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const searchResults = query ? searchProducts(query) : [];
  const popularProducts = getPopularProducts();

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-8 sm:px-6 sm:py-12">
      <HeroBanner />
      <SearchBar defaultValue={query} />

      {query ? (
        <section className="space-y-5">
          <h2 className="text-xl font-semibold text-stone-900">
            搜索结果：「{query}」
          </h2>
          <ProductGrid
            products={searchResults}
            emptyMessage={`未找到与「${query}」相关的商品`}
          />
        </section>
      ) : (
        <>
          <CategoryGrid />
          <PopularProducts products={popularProducts} />
          <PromotionBanner />
        </>
      )}
    </div>
  );
}
