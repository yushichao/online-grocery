import { getAdminUserId } from "@/lib/auth/admin";
import { createProduct, listAllProducts } from "@/lib/db/products";
import { parseProductInput } from "@/lib/validation";

export async function GET() {
  if (!(await getAdminUserId())) {
    return Response.json({ error: "未授权" }, { status: 401 });
  }
  const products = await listAllProducts();
  return Response.json(products, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  if (!(await getAdminUserId())) {
    return Response.json({ error: "未授权" }, { status: 401 });
  }
  const product = parseProductInput(await request.json());
  if (!product) {
    return Response.json({ error: "商品信息无效" }, { status: 400 });
  }
  return Response.json(await createProduct(product), { status: 201 });
}
