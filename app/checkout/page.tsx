"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useCart();

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart");
    }
  }, [items.length, router]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8">
        <Link
          href="/cart"
          className="mb-4 inline-block text-sm text-stone-500 transition-colors hover:text-stone-900"
        >
          ← 返回购物车
        </Link>
        <h1 className="text-2xl font-semibold text-stone-900 sm:text-3xl">
          确认订单
        </h1>
        <p className="mt-2 text-sm text-stone-500">
          请填写配送信息，我们将通过电话确认订单。
        </p>
      </header>

      <CheckoutForm />
    </div>
  );
}
