import { listPublicProducts } from "@/lib/db/products";

export async function GET() {
  try {
    const products = await listPublicProducts();
    return Response.json(products, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json({ error: "商品加载失败" }, { status: 500 });
  }
}
