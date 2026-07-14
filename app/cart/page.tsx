"use client";

import Link from "next/link";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartSummary } from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items } = useCart();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-900 sm:text-3xl">
          购物车
        </h1>
        <p className="mt-2 text-sm text-stone-500">
          {items.length > 0
            ? `共 ${items.length} 种商品`
            : "您的购物车是空的"}
        </p>
      </header>

      {items.length === 0 ? (
        <div className="rounded-3xl bg-white px-6 py-20 text-center shadow-[0_2px_24px_rgba(0,0,0,0.06)]">
          <p className="mb-6 text-stone-500">还没有添加任何商品</p>
          <Button href="/">去选购</Button>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {items.map((item) => (
              <CartItemRow key={item.product.id} item={item} />
            ))}
            <Link
              href="/"
              className="inline-block text-sm text-stone-500 transition-colors hover:text-stone-900"
            >
              ← 继续购物
            </Link>
          </div>
          <div className="lg:sticky lg:top-24 lg:self-start">
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
}
