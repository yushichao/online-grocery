import "server-only";
import { createClient } from "@/lib/supabase/server";

export const PRODUCT_IMAGE_BUCKET = "product-images";
export const MAX_PRODUCT_IMAGE_BYTES = 300 * 1024;

export function isProductImagePath(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^products\/[0-9a-f-]{36}\.webp$/.test(value)
  );
}

export async function uploadProductImage(file: File): Promise<string> {
  if (file.type !== "image/webp" || file.size > MAX_PRODUCT_IMAGE_BYTES) {
    throw new Error("图片必须是小于 300KB 的 WebP 文件");
  }

  const path = `products/${crypto.randomUUID()}.webp`;
  const supabase = await createClient();
  const { error } = await supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .upload(path, new Uint8Array(await file.arrayBuffer()), {
      contentType: "image/webp",
      cacheControl: "31536000",
      upsert: false,
    });

  if (error) throw new Error(`图片上传失败：${error.message}`);
  return path;
}

export async function removeProductImage(path: string): Promise<void> {
  if (!isProductImagePath(path)) return;
  const supabase = await createClient();
  const { error } = await supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .remove([path]);
  if (error) throw new Error(`旧图片删除失败：${error.message}`);
}
