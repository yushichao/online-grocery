import "server-only";
import sharp from "sharp";
import { createClient } from "@/lib/supabase/server";

export const PRODUCT_IMAGE_BUCKET = "product-images";
export const MAX_PRODUCT_IMAGE_BYTES = 300 * 1024;
const ACCEPTED_UPLOAD_TYPES = new Set(["image/jpeg", "image/webp"]);

async function convertToWebp(file: File): Promise<Uint8Array> {
  if (
    !ACCEPTED_UPLOAD_TYPES.has(file.type) ||
    file.size > MAX_PRODUCT_IMAGE_BYTES
  ) {
    throw new Error("图片必须是小于 300KB 的 JPEG 或 WebP 文件");
  }

  const input = Buffer.from(await file.arrayBuffer());
  let output: Buffer | null = null;

  for (const dimension of [1400, 1200, 1000, 800]) {
    for (const quality of [82, 74, 66, 58, 50, 42]) {
      output = await sharp(input, { limitInputPixels: 40_000_000 })
        .rotate()
        .resize({
          width: dimension,
          height: dimension,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality, effort: 4 })
        .toBuffer();
      if (output.byteLength <= 250 * 1024) break;
    }
    if (output && output.byteLength <= MAX_PRODUCT_IMAGE_BYTES) break;
  }

  if (!output || output.byteLength > MAX_PRODUCT_IMAGE_BYTES) {
    throw new Error("服务端转换后的 WebP 仍超过 300KB");
  }
  return new Uint8Array(output);
}

export function isProductImagePath(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^products\/[0-9a-f-]{36}\.webp$/.test(value)
  );
}

export async function uploadProductImage(file: File): Promise<string> {
  const webp = await convertToWebp(file);
  const path = `products/${crypto.randomUUID()}.webp`;
  const supabase = await createClient();
  const { error } = await supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .upload(path, webp, {
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
