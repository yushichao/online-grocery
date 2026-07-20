import { createOrder } from "@/lib/db/orders";
import { parseCheckoutFormData } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return Response.json({ error: "订单内容无效" }, { status: 400 });
    }
    const input = body as Record<string, unknown>;
    const formData = parseCheckoutFormData(input.formData);
    const rawItems = input.items;
    if (!formData || !Array.isArray(rawItems) || rawItems.length === 0) {
      return Response.json({ error: "订单内容无效" }, { status: 400 });
    }
    const items = rawItems.flatMap((value) => {
      if (!value || typeof value !== "object") return [];
      const item = value as Record<string, unknown>;
      if (
        typeof item.productId !== "string" ||
        typeof item.quantity !== "number" ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0 ||
        item.quantity > 99
      ) {
        return [];
      }
      return [{ productId: item.productId, quantity: item.quantity }];
    });
    if (items.length !== rawItems.length) {
      return Response.json({ error: "商品数量无效" }, { status: 400 });
    }

    const order = await createOrder({ items, formData });
    return Response.json(order, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "订单提交失败";
    const isExpected =
      message.includes("库存不足") || message.includes("不存在或已下架");
    return Response.json(
      { error: isExpected ? message : "订单提交失败，请稍后重试" },
      { status: isExpected ? 409 : 500 },
    );
  }
}
