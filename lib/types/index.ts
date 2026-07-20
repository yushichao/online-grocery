export type CategorySlug =
  | "vegetables"
  | "frozen-food"
  | "snacks"
  | "drinks"
  | "instant-noodles"
  | "seasonings";

export interface Category {
  id: string;
  slug: CategorySlug;
  name: string;
  nameJa: string;
  description: string;
  emoji: string;
}

export interface Product {
  id: string;
  name: string;
  nameJa: string;
  description: string;
  price: number;
  stock: number;
  active: boolean;
  imagePath: string | null;
  categorySlug: CategorySlug;
  unit: string;
  popular?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CheckoutFormData {
  customerName: string;
  phone: string;
  address: string;
  deliveryTime: string;
  notes: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  formData: CheckoutFormData;
  createdAt: string;
  status: OrderStatus;
}

export interface OrderItem {
  productId: string | null;
  productName: string;
  productNameJa: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "completed"
  | "cancelled";
