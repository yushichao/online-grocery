"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Order } from "@/lib/types";
import { formatPrice } from "@/lib/utils/format";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "";
  const [order] = useState<Order | null>(() => {
    if (typeof window === "undefined") return null;

    try {
      const stored = sessionStorage.getItem("last-order");
      return stored ? (JSON.parse(stored) as Order) : null;
    } catch {
      return null;
    }
  });

  const displayOrderId = order?.id ?? orderId;

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 sm:py-24">
      <Card className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl">
          ✓
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-stone-900">订单已提交</h1>
          <p className="text-sm leading-relaxed text-stone-500">
            感谢您的订购！我们已收到您的订单，稍后将通过电话与您确认配送详情。
          </p>
        </div>

        {displayOrderId ? (
          <div className="rounded-2xl bg-stone-50 px-4 py-3">
            <p className="text-xs text-stone-400">订单编号</p>
            <p className="font-mono text-sm font-medium text-stone-900">
              {displayOrderId}
            </p>
          </div>
        ) : null}

        {order ? (
          <dl className="space-y-2 text-left text-sm text-stone-600">
            <div className="flex justify-between">
              <dt>收货人</dt>
              <dd>{order.formData.customerName}</dd>
            </div>
            <div className="flex justify-between">
              <dt>配送时间</dt>
              <dd>{order.formData.deliveryTime}</dd>
            </div>
            <div className="flex justify-between border-t border-stone-100 pt-2 font-semibold text-stone-900">
              <dt>订单金额</dt>
              <dd>{formatPrice(order.total)}</dd>
            </div>
          </dl>
        ) : null}

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-center">
          <Button href="/" variant="primary">
            返回首页
          </Button>
          <Button href="/category/vegetables" variant="outline">
            继续购物
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-lg px-4 py-24 text-center text-stone-500">
          加载中...
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
