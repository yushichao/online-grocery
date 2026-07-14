"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";

interface AddToCartButtonProps {
  product: Product;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export function AddToCartButton({
  product,
  size = "md",
  fullWidth = false,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Button
      type="button"
      variant={added ? "secondary" : "primary"}
      size={size}
      onClick={handleClick}
      className={fullWidth ? "w-full" : ""}
      aria-label={`将 ${product.name} 加入购物车`}
    >
      {added ? "已添加" : "加入购物车"}
    </Button>
  );
}
