"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useCart } from "@/context/CartContext";
import type { CheckoutFormData } from "@/lib/types";
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
  const { items, total, clearCart } = useCart();
  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryFee = total >= 3000 ? 0 : 300;
  const grandTotal = total + deliveryFee;

  function validate(): boolean {
    const nextErrors: Partial<CheckoutFormData> = {};

    if (!formData.customerName.trim()) {
      nextErrors.customerName = "请输入姓名";
    }
    if (!formData.phone.trim()) {
      nextErrors.phone = "请输入电话号码";
    }
    if (!formData.address.trim()) {
      nextErrors.address = "请输入配送地址";
    }
    if (!formData.deliveryTime) {
      nextErrors.deliveryTime = "请选择配送时间";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
    const order = {
      id: orderId,
      items,
      total: grandTotal,
      formData,
      createdAt: new Date().toISOString(),
    };

    sessionStorage.setItem("last-order", JSON.stringify(order));
    clearCart();
    router.push(`/order-success?orderId=${orderId}`);
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
          <div className="flex justify-between">
            <dt>配送费</dt>
            <dd>{deliveryFee === 0 ? "免费" : formatPrice(deliveryFee)}</dd>
          </div>
          <div className="flex justify-between border-t border-stone-100 pt-2 text-base font-semibold text-stone-900">
            <dt>合计</dt>
            <dd>{formatPrice(grandTotal)}</dd>
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
        <p className="text-center text-xs text-stone-400">
          提交后我们将通过电话确认订单，暂不支持在线支付。
        </p>
      </div>
    </form>
  );
}
