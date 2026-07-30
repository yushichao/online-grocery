const MAX_SOURCE_BYTES = 10 * 1024 * 1024;
const MAX_DIMENSION = 1400;
const TARGET_BYTES = 250 * 1024;
const MAX_OUTPUT_BYTES = 300 * 1024;
const SUPPORTED_EXTENSIONS = /\.(heic|heif|jpe?g|png|webp)$/i;
const HEIC_EXTENSIONS = /\.(heic|heif)$/i;
const HEIC_MIME_TYPES = new Set([
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
]);

type CanvasOutputType = "image/webp" | "image/jpeg";

function loadImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("无法读取这张图片"));
    };
    image.src = url;
  });
}

function looksLikeHeic(file: File) {
  return (
    HEIC_MIME_TYPES.has(file.type.toLowerCase()) ||
    HEIC_EXTENSIONS.test(file.name)
  );
}

async function decodeHeic(file: File): Promise<Blob> {
  try {
    // The decoder is large, so only load its CSP-safe WASM build for HEIC files.
    const { heicTo } = await import("heic-to/csp");
    return await heicTo({
      blob: file,
      type: "image/jpeg",
      quality: 0.9,
    });
  } catch {
    throw new Error("HEIC 照片解码失败，请重试或选择另一张照片");
  }
}

async function loadSourceImage(file: File): Promise<HTMLImageElement> {
  if (looksLikeHeic(file)) {
    return loadImage(await decodeHeic(file));
  }

  try {
    return await loadImage(file);
  } catch (nativeDecodeError) {
    // Some iOS pickers omit the HEIC extension and report a generic MIME type.
    // Only load the format detector after the browser's native decoder fails.
    try {
      const { isHeic } = await import("heic-to/csp");
      if (await isHeic(file)) {
        return loadImage(await decodeHeic(file));
      }
    } catch {
      // Preserve the browser's original error for non-HEIC or corrupt files.
    }
    throw nativeDecodeError;
  }
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: CanvasOutputType,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("图片压缩失败"));
          return;
        }
        resolve(blob);
      },
      type,
      quality,
    );
  });
}

async function getCanvasOutputType(): Promise<CanvasOutputType> {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const blob = await canvasToBlob(canvas, "image/webp", 0.8);
  return blob.type === "image/webp" ? "image/webp" : "image/jpeg";
}

export async function compressProductImage(file: File): Promise<File> {
  if (
    !file.type.startsWith("image/") &&
    !SUPPORTED_EXTENSIONS.test(file.name)
  ) {
    throw new Error("请选择 HEIC、JPG、PNG 或 WebP 图片");
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error("原始图片不能超过 10MB");
  }

  const image = await loadSourceImage(file);
  const outputType = await getCanvasOutputType();
  const scale = Math.min(
    1,
    MAX_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight),
  );
  let width = Math.max(1, Math.round(image.naturalWidth * scale));
  let height = Math.max(1, Math.round(image.naturalHeight * scale));
  let output: Blob | null = null;

  for (let sizeAttempt = 0; sizeAttempt < 5; sizeAttempt += 1) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("图片处理失败");
    if (outputType === "image/jpeg") {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);
    }
    context.drawImage(image, 0, 0, width, height);

    for (const quality of [0.86, 0.78, 0.7, 0.62, 0.54, 0.46]) {
      output = await canvasToBlob(canvas, outputType, quality);
      if (output.size <= TARGET_BYTES) break;
    }

    if (output && output.size <= MAX_OUTPUT_BYTES) break;
    width = Math.max(1, Math.round(width * 0.85));
    height = Math.max(1, Math.round(height * 0.85));
  }

  if (!output || output.size > MAX_OUTPUT_BYTES) {
    throw new Error("图片压缩后仍超过 300KB，请选择更简单的图片");
  }

  const extension = outputType === "image/webp" ? "webp" : "jpg";
  return new File([output], `product-image.${extension}`, {
    type: outputType,
    lastModified: Date.now(),
  });
}
