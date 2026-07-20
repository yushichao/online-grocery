"use client";

import Link from "next/link";
import type { CartItem } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils/format";
import { ProductImage } from "@/components/product/ProductImage";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity } = item;
  const lineTotal = product.price * quantity;

  return (
    <div className="flex gap-4 rounded-3xl bg-white p-4 shadow-[0_2px_24px_rgba(0,0,0,0.06)] sm:p-5">
      <div className="w-24 shrink-0 sm:w-28">
        <ProductImage product={product} size="sm" linkToDetail />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              href={`/product/${product.id}`}
              className="font-semibold text-stone-900 hover:text-stone-700"
            >
              {product.name}
            </Link>
            <p className="text-sm text-stone-500">{product.nameJa}</p>
            <p className="mt-1 text-sm text-stone-400">
              {formatPrice(product.price)} / {product.unit}
            </p>
          </div>
          <button
            type="button"
            onClick={() => removeItem(product.id)}
            className="shrink-0 text-sm text-stone-400 transition-colors hover:text-red-600"
            aria-label={`移除 ${product.name}`}
          >
            移除
          </button>
        </div>
        <div className="flex items-center justify-between">
          <QuantityControl
            quantity={quantity}
            canIncrease={quantity < product.stock}
            onDecrease={() => updateQuantity(product.id, quantity - 1)}
            onIncrease={() => updateQuantity(product.id, quantity + 1)}
          />
          <p className="font-semibold text-stone-900">
            {formatPrice(lineTotal)}
          </p>
        </div>
      </div>
    </div>
  );
}

interface QuantityControlProps {
  quantity: number;
  canIncrease: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
}

function QuantityControl({
  quantity,
  canIncrease,
  onDecrease,
  onIncrease,
}: QuantityControlProps) {
  return (
    <div className="flex items-center gap-3 rounded-full bg-stone-100 px-1 py-1">
      <button
        type="button"
        onClick={onDecrease}
        className="flex h-8 w-8 items-center justify-center rounded-full text-stone-600 transition-colors hover:bg-white hover:text-stone-900"
        aria-label="减少数量"
      >
        −
      </button>
      <span className="min-w-6 text-center text-sm font-medium text-stone-900">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={!canIncrease}
        className="flex h-8 w-8 items-center justify-center rounded-full text-stone-600 transition-colors hover:bg-white hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="增加数量"
      >
        +
      </button>
    </div>
  );
}
