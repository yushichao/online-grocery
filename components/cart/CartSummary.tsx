"use client";

import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils/format";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function CartSummary() {
  const { total, itemCount } = useCart();

  return (
    <Card className="space-y-5">
      <h2 className="text-lg font-semibold text-stone-900">订单摘要</h2>
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between text-stone-600">
          <dt>商品小计（{itemCount} 件）</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
        <div className="flex justify-between border-t border-stone-100 pt-3 text-base font-semibold text-stone-900">
          <dt>合计</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>
      <Button href="/checkout" size="lg" className="w-full">
        去结算
      </Button>
    </Card>
  );
}
