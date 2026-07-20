import { getAdminUserId } from "@/lib/auth/admin";
import { updateProduct } from "@/lib/db/products";
import { parseProductInput } from "@/lib/validation";

interface ProductRouteProps {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: ProductRouteProps) {
  if (!(await getAdminUserId())) {
    return Response.json({ error: "未授权" }, { status: 401 });
  }
  const product = parseProductInput(await request.json());
  if (!product) {
    return Response.json({ error: "商品信息无效" }, { status: 400 });
  }
  const { id } = await params;
  const updated = await updateProduct(id, product);
  return updated
    ? Response.json(updated)
    : Response.json({ error: "商品不存在" }, { status: 404 });
}
