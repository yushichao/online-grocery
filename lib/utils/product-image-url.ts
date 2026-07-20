const storageBaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");

export function getProductImageUrl(path: string | null): string | null {
  if (!storageBaseUrl || !path) return null;
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  return `${storageBaseUrl}/storage/v1/object/public/product-images/${encodedPath}`;
}
