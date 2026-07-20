import { getAdminUserId } from "@/lib/auth/admin";
import { listOrders } from "@/lib/db/orders";

export async function GET() {
  if (!(await getAdminUserId())) {
    return Response.json({ error: "未授权" }, { status: 401 });
  }
  return Response.json(await listOrders(), {
    headers: { "Cache-Control": "no-store" },
  });
}
