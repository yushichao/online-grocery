import { getAdminUserId } from "@/lib/auth/admin";
import { updateOrderStatus } from "@/lib/db/orders";
import type { OrderStatus } from "@/lib/types";

const orderStatuses = new Set<OrderStatus>([
  "pending",
  "confirmed",
  "preparing",
  "completed",
  "cancelled",
]);

interface OrderRouteProps {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: OrderRouteProps) {
  if (!(await getAdminUserId())) {
    return Response.json({ error: "未授权" }, { status: 401 });
  }
  const body: unknown = await request.json();
  const status =
    body && typeof body === "object"
      ? (body as Record<string, unknown>).status
      : null;
  if (typeof status !== "string" || !orderStatuses.has(status as OrderStatus)) {
    return Response.json({ error: "订单状态无效" }, { status: 400 });
  }
  const { id } = await params;
  const updated = await updateOrderStatus(id, status as OrderStatus);
  return updated
    ? Response.json({ id, status })
    : Response.json({ error: "订单不存在" }, { status: 404 });
}
