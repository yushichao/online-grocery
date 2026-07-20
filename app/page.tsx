import { HeroBanner } from "@/components/home/HeroBanner";
import { HomeCatalog } from "@/components/home/HomeCatalog";
import { SearchBar } from "@/components/home/SearchBar";

interface HomePageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-8 sm:px-6 sm:py-12">
      <HeroBanner />
      <SearchBar defaultValue={query} />

      <HomeCatalog query={query} />
    </div>
  );
}
