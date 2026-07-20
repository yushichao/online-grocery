import { getAdminUserId } from "@/lib/auth/admin";
import { getProductById, updateProduct } from "@/lib/db/products";
import { removeProductImage } from "@/lib/storage/product-images";
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
  const existing = await getProductById(id);
  if (!existing) {
    return Response.json({ error: "商品不存在" }, { status: 404 });
  }
  const updated = await updateProduct(id, product);
  if (!updated) {
    return Response.json({ error: "商品不存在" }, { status: 404 });
  }

  if (existing.imagePath && existing.imagePath !== updated.imagePath) {
    try {
      await removeProductImage(existing.imagePath);
    } catch (error) {
      console.error("Failed to remove replaced product image", error);
    }
  }

  return Response.json(updated);
}
