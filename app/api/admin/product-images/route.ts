import { getAdminUserId } from "@/lib/auth/admin";
import {
  isProductImagePath,
  removeProductImage,
  uploadProductImage,
} from "@/lib/storage/product-images";

export async function POST(request: Request) {
  if (!(await getAdminUserId())) {
    return Response.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("image");
    if (!(file instanceof File)) {
      return Response.json({ error: "请选择图片" }, { status: 400 });
    }
    const path = await uploadProductImage(file);
    return Response.json({ path }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "图片上传失败";
    return Response.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  if (!(await getAdminUserId())) {
    return Response.json({ error: "未授权" }, { status: 401 });
  }

  const body: unknown = await request.json();
  const path =
    body && typeof body === "object"
      ? (body as Record<string, unknown>).path
      : null;
  if (!isProductImagePath(path)) {
    return Response.json({ error: "图片路径无效" }, { status: 400 });
  }

  try {
    await removeProductImage(path);
    return new Response(null, { status: 204 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "图片删除失败";
    return Response.json({ error: message }, { status: 500 });
  }
}
