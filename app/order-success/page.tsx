"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useCart } from "@/context/CartContext";
import type { Order } from "@/lib/types";
import { formatPrice } from "@/lib/utils/format";

const PAYPAY_QR_PATH = "/payment-codes/paypay.png";
const WECHAT_ALIPAY_QR_PATH = "/payment-codes/wechat-alipay.png";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "";
  const { clearCart } = useCart();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const stored = sessionStorage.getItem("last-order");
        const parsed = stored ? (JSON.parse(stored) as Order) : null;
        setOrder(parsed);
        if (parsed && parsed.id === orderId) clearCart();
      } catch {
        setOrder(null);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [clearCart, orderId]);

  const displayOrderId = order?.id ?? orderId;

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 sm:py-24">
      <Card className="space-y-6 text-center">
        <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-200/70 ring-8 ring-emerald-50">
          <svg
            viewBox="0 0 24 24"
            className="h-9 w-9"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m6.5 12.5 3.5 3.5 7.5-8" />
          </svg>
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
            <div className="flex justify-between border-t border-stone-100 pt-2 font-semibold text-stone-900">
              <dt>订单金额</dt>
              <dd>{formatPrice(order.total)}</dd>
            </div>
          </dl>
        ) : null}

        {order ? (
          <section className="space-y-5 border-t border-stone-100 pt-6 text-left">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-stone-900">扫码付款</h2>
              <p className="mt-1 text-sm text-stone-500">
                请选择一种付款方式，按订单金额完成支付。
              </p>
              <p className="mt-2 text-xl font-semibold text-stone-900">
                {formatPrice(order.total)}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <PaymentCodeCard
                paymentName="PayPay"
                description="打开 PayPay 扫描二维码"
                imageUrl={PAYPAY_QR_PATH}
                tone="paypay"
              />
              <PaymentCodeCard
                paymentName="微信 / 支付宝"
                description="使用微信或支付宝扫描二维码"
                imageUrl={WECHAT_ALIPAY_QR_PATH}
                tone="wechat"
              />
            </div>
            <p className="text-center text-xs leading-relaxed text-stone-400">
              付款时请核对金额，并在付款备注中填写订单编号。
              <br />
              如果有任何问题，请通过电话或微信联系我们。
            </p>
          </section>
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

function PaymentCodeCard({
  paymentName,
  description,
  imageUrl,
  tone,
}: {
  paymentName: string;
  description: string;
  imageUrl: string;
  tone: "paypay" | "wechat";
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border text-center ${
        tone === "paypay"
          ? "border-red-100 bg-red-50/70"
          : "border-emerald-100 bg-emerald-50/70"
      }`}
    >
      <div className="p-4">
        <p className="flex min-h-10 items-center justify-center text-xs leading-relaxed text-stone-500">
          {description}
        </p>
        <div className="relative mx-auto mt-3 aspect-square w-full max-w-56 overflow-hidden rounded-xl bg-white">
          <Image
            src={imageUrl}
            alt={`${paymentName} 付款二维码`}
            fill
            unoptimized
            className="object-contain p-2"
          />
        </div>
      </div>
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
