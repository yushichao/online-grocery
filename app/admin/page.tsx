import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { requireAdmin } from "@/lib/auth/admin";
import { listOrders } from "@/lib/db/orders";
import { listAllProducts } from "@/lib/db/products";

export const metadata: Metadata = {
  title: "管理后台 | SHOW LIFE",
  description: "管理商品与顾客订单。",
};

export default async function AdminPage() {
  await requireAdmin();
  const [initialOrders, initialProducts] = await Promise.all([
    listOrders(),
    listAllProducts(),
  ]);

  return (
    <AdminDashboard
      initialOrders={initialOrders}
      initialProducts={initialProducts}
    />
  );
}
