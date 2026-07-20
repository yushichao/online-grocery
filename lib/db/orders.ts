import "server-only";
import { sql } from "@/lib/db/client";
import type {
  CheckoutFormData,
  Order,
  OrderItem,
  OrderStatus,
} from "@/lib/types";

interface OrderRow {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  delivery_time: string;
  notes: string;
  total: number;
  status: OrderStatus;
  created_at: Date;
}

interface OrderItemRow {
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_name_ja: string;
  unit: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

interface ProductOrderRow {
  id: string;
  name: string;
  name_ja: string;
  unit: string;
  price: number;
  stock: number;
}

export interface CreateOrderInput {
  items: { productId: string; quantity: number }[];
  formData: CheckoutFormData;
}

function mapOrderItem(row: OrderItemRow): OrderItem {
  return {
    productId: row.product_id,
    productName: row.product_name,
    productNameJa: row.product_name_ja,
    unit: row.unit,
    unitPrice: row.unit_price,
    quantity: row.quantity,
    subtotal: row.subtotal,
  };
}

function mapOrder(row: OrderRow, items: OrderItemRow[]): Order {
  return {
    id: row.id,
    items: items.map(mapOrderItem),
    total: row.total,
    formData: {
      customerName: row.customer_name,
      phone: row.phone,
      address: row.address,
      deliveryTime: row.delivery_time,
      notes: row.notes,
    },
    createdAt: row.created_at.toISOString(),
    status: row.status,
  };
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  return sql.begin(async (transaction) => {
    const requestedItems = new Map<string, number>();
    for (const item of input.items) {
      requestedItems.set(
        item.productId,
        (requestedItems.get(item.productId) ?? 0) + item.quantity,
      );
    }
    const productIds = [...requestedItems.keys()];
    const products = await transaction<ProductOrderRow[]>`
      select id, name, name_ja, unit, price, stock
      from public.products
      where id = any(${productIds}) and active = true
      for update
    `;

    if (products.length !== productIds.length) {
      throw new Error("部分商品不存在或已下架");
    }

    const lines: OrderItem[] = products.map((product) => {
      const quantity = requestedItems.get(product.id) ?? 0;
      if (quantity <= 0 || quantity > product.stock) {
        throw new Error(`${product.name} 库存不足`);
      }
      return {
        productId: product.id,
        productName: product.name,
        productNameJa: product.name_ja,
        unit: product.unit,
        unitPrice: product.price,
        quantity,
        subtotal: product.price * quantity,
      };
    });

    const total = lines.reduce((sum, item) => sum + item.subtotal, 0);
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${crypto
      .randomUUID()
      .slice(0, 6)
      .toUpperCase()}`;
    const [orderRow] = await transaction<OrderRow[]>`
      insert into public.orders (
        id, customer_name, phone, address, delivery_time, notes, total, status
      ) values (
        ${orderId}, ${input.formData.customerName}, ${input.formData.phone},
        ${input.formData.address}, ${input.formData.deliveryTime},
        ${input.formData.notes}, ${total}, 'pending'
      )
      returning id, customer_name, phone, address, delivery_time, notes,
        total, status, created_at
    `;

    for (const line of lines) {
      await transaction`
        insert into public.order_items (
          order_id, product_id, product_name, product_name_ja, unit,
          unit_price, quantity, subtotal
        ) values (
          ${orderId}, ${line.productId}, ${line.productName},
          ${line.productNameJa}, ${line.unit}, ${line.unitPrice},
          ${line.quantity}, ${line.subtotal}
        )
      `;
      await transaction`
        update public.products
        set stock = stock - ${line.quantity}
        where id = ${line.productId}
      `;
    }

    return mapOrder(orderRow, lines.map((line) => ({
      order_id: orderId,
      product_id: line.productId,
      product_name: line.productName,
      product_name_ja: line.productNameJa,
      unit: line.unit,
      unit_price: line.unitPrice,
      quantity: line.quantity,
      subtotal: line.subtotal,
    })));
  });
}

export async function listOrders(): Promise<Order[]> {
  const orders = await sql<OrderRow[]>`
    select id, customer_name, phone, address, delivery_time, notes,
      total, status, created_at
    from public.orders
    order by created_at desc
  `;
  if (orders.length === 0) return [];

  const orderIds = orders.map((order) => order.id);
  const items = await sql<OrderItemRow[]>`
    select order_id, product_id, product_name, product_name_ja, unit,
      unit_price, quantity, subtotal
    from public.order_items
    where order_id = any(${orderIds})
    order by id
  `;

  return orders.map((order) =>
    mapOrder(
      order,
      items.filter((item) => item.order_id === order.id),
    ),
  );
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<boolean> {
  const result = await sql`
    update public.orders set status = ${status} where id = ${id}
  `;
  return result.count > 0;
}
