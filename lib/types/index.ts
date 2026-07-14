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
  categorySlug: CategorySlug;
  unit: string;
  popular?: boolean;
  promotion?: string;
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
  items: CartItem[];
  total: number;
  formData: CheckoutFormData;
  createdAt: string;
}
