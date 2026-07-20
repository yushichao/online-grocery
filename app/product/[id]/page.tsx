import { ProductDetailContent } from "@/components/product/ProductDetailContent";
import { getProductById } from "@/lib/data/products";

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
  return <ProductDetailContent id={id} />;
}
