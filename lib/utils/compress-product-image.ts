const MAX_SOURCE_BYTES = 10 * 1024 * 1024;
const MAX_DIMENSION = 1400;
const TARGET_BYTES = 250 * 1024;
const MAX_OUTPUT_BYTES = 300 * 1024;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
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

function canvasToWebp(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob || blob.type !== "image/webp") {
          reject(new Error("当前浏览器不支持 WebP 图片转换"));
          return;
        }
        resolve(blob);
      },
      "image/webp",
      quality,
    );
  });
}

export async function compressProductImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) {
    throw new Error("请选择 JPG、PNG 或 WebP 图片");
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error("原始图片不能超过 10MB");
  }

  const image = await loadImage(file);
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
    context.drawImage(image, 0, 0, width, height);

    for (const quality of [0.86, 0.78, 0.7, 0.62, 0.54, 0.46]) {
      output = await canvasToWebp(canvas, quality);
      if (output.size <= TARGET_BYTES) break;
    }

    if (output && output.size <= MAX_OUTPUT_BYTES) break;
    width = Math.max(1, Math.round(width * 0.85));
    height = Math.max(1, Math.round(height * 0.85));
  }

  if (!output || output.size > MAX_OUTPUT_BYTES) {
    throw new Error("图片压缩后仍超过 300KB，请选择更简单的图片");
  }

  return new File([output], "product-image.webp", {
    type: "image/webp",
    lastModified: Date.now(),
  });
}
