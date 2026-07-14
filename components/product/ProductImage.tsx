import Link from "next/link";
import type { Product } from "@/lib/types";
import {
  getProductEmoji,
  getProductGradient,
} from "@/lib/utils/product-image";

interface ProductImageProps {
  product: Product;
  size?: "sm" | "md" | "lg";
  linkToDetail?: boolean;
}

const sizeStyles = {
  sm: "h-36",
  md: "h-48",
  lg: "h-72",
};

const emojiSizes = {
  sm: "text-4xl",
  md: "text-5xl",
  lg: "text-7xl",
};

export function ProductImage({
  product,
  size = "md",
  linkToDetail = false,
}: ProductImageProps) {
  const content = (
    <div
      className={`relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${getProductGradient(product.categorySlug)} ${sizeStyles[size]}`}
      aria-hidden
    >
      <span className={`${emojiSizes[size]} select-none`}>
        {getProductEmoji(product.categorySlug)}
      </span>
    </div>
  );

  if (linkToDetail) {
    return (
      <Link
        href={`/product/${product.id}`}
        className="block transition-opacity hover:opacity-90"
      >
        {content}
      </Link>
    );
  }

  return content;
}
