"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useCart } from "@/context/CartContext";
import type { CheckoutFormData, Order } from "@/lib/types";
import { formatPrice } from "@/lib/utils/format";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";

const deliveryTimeOptions = [
  { value: "", label: "请选择配送时间" },
  { value: "10:00-12:00", label: "10:00 – 12:00" },
  { value: "12:00-14:00", label: "12:00 – 14:00" },
  { value: "14:00-16:00", label: "14:00 – 16:00" },
  { value: "16:00-18:00", label: "16:00 – 18:00" },
  { value: "18:00-20:00", label: "18:00 – 20:00" },
];

const initialFormData: CheckoutFormData = {
  customerName: "",
  phone: "",
  address: "",
  deliveryTime: "",
  notes: "",
};

export function CheckoutForm() {
  const router = useRouter();
  const { items, total } = useCart();
  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function validate(): boolean {
    const nextErrors: Partial<CheckoutFormData> = {};

    if (!formData.customerName.trim()) {
      nextErrors.customerName = "请输入姓名";
    }
    if (!formData.phone.trim()) {
      nextErrors.phone = "请输入电话号码";
    } else if (!/^[0-9+()\-\s]{8,20}$/.test(formData.phone.trim())) {
      nextErrors.phone = "请输入有效的电话号码";
    }
    if (!formData.address.trim()) {
      nextErrors.address = "请输入配送地址";
    } else if (formData.address.trim().length < 6) {
      nextErrors.address = "请填写完整地址";
    }
    if (!formData.deliveryTime) {
      nextErrors.deliveryTime = "请选择配送时间";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
          formData,
        }),
      });
      const result = (await response.json()) as Order | { error?: string };
      if (!response.ok) {
        throw new Error("error" in result ? result.error : "订单提交失败");
      }
      const order = result as Order;
      sessionStorage.setItem("last-order", JSON.stringify(order));
      router.push(`/order-success?orderId=${encodeURIComponent(order.id)}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "订单提交失败，请重试");
      setIsSubmitting(false);
    }
  }

  function updateField<K extends keyof CheckoutFormData>(
    field: K,
    value: CheckoutFormData[K],
  ) {
    setFormData((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-5 rounded-3xl bg-white p-6 shadow-[0_2px_24px_rgba(0,0,0,0.06)] sm:p-8">
        <h2 className="text-lg font-semibold text-stone-900">配送信息</h2>
        <Input
          label="姓名"
          name="customerName"
          value={formData.customerName}
          onChange={(event) => updateField("customerName", event.target.value)}
          placeholder="请输入您的姓名"
          error={errors.customerName}
          required
        />
        <Input
          label="电话"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={(event) => updateField("phone", event.target.value)}
          placeholder="090-XXXX-XXXX"
          error={errors.phone}
          required
        />
        <Input
          label="配送地址"
          name="address"
          value={formData.address}
          onChange={(event) => updateField("address", event.target.value)}
          placeholder="邮编、都道府县、市区町村、番地"
          error={errors.address}
          required
        />
        <Select
          label="配送时间"
          name="deliveryTime"
          value={formData.deliveryTime}
          onChange={(event) => updateField("deliveryTime", event.target.value)}
          options={deliveryTimeOptions}
          error={errors.deliveryTime}
          required
        />
        <Textarea
          label="订单备注"
          name="notes"
          value={formData.notes}
          onChange={(event) => updateField("notes", event.target.value)}
          placeholder="如有特殊要求请在此注明（选填）"
        />
      </div>

      <div className="space-y-4 rounded-3xl bg-white p-6 shadow-[0_2px_24px_rgba(0,0,0,0.06)] sm:p-8">
        <h2 className="text-lg font-semibold text-stone-900">订单金额</h2>
        <dl className="space-y-2 text-sm text-stone-600">
          <div className="flex justify-between">
            <dt>商品小计</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
          <div className="flex justify-between border-t border-stone-100 pt-2 text-base font-semibold text-stone-900">
            <dt>合计</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
        </dl>
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting || items.length === 0}
        >
          {isSubmitting ? "提交中..." : "提交订单"}
        </Button>
        {submitError ? (
          <p className="text-center text-sm text-red-600">{submitError}</p>
        ) : null}
        <p className="text-center text-xs text-stone-400">
          提交后可在管理后台查看和处理订单。
        </p>
      </div>
    </form>
  );
}
