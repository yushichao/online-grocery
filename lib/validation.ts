import type { CategorySlug, CheckoutFormData, Product } from "@/lib/types";

const categorySlugs = new Set<CategorySlug>([
  "vegetables",
  "frozen-food",
  "snacks",
  "drinks",
  "instant-noodles",
  "seasonings",
]);

export function parseProductInput(value: unknown): Omit<Product, "id"> | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  const categorySlug = input.categorySlug as CategorySlug;
  if (
    typeof input.name !== "string" ||
    !input.name.trim() ||
    typeof input.nameJa !== "string" ||
    typeof input.description !== "string" ||
    typeof input.price !== "number" ||
    !Number.isInteger(input.price) ||
    input.price < 0 ||
    typeof input.stock !== "number" ||
    !Number.isInteger(input.stock) ||
    input.stock < 0 ||
    !categorySlugs.has(categorySlug) ||
    typeof input.unit !== "string" ||
    !input.unit.trim() ||
    typeof input.active !== "boolean"
  ) {
    return null;
  }
  return {
    name: input.name.trim(),
    nameJa: input.nameJa.trim(),
    description: input.description.trim(),
    price: input.price,
    stock: input.stock,
    categorySlug,
    unit: input.unit.trim(),
    popular: Boolean(input.popular),
    active: input.active,
  };
}

export function parseCheckoutFormData(value: unknown): CheckoutFormData | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  if (
    typeof input.customerName !== "string" ||
    !input.customerName.trim() ||
    typeof input.phone !== "string" ||
    !/^[0-9+()\-\s]{8,20}$/.test(input.phone.trim()) ||
    typeof input.address !== "string" ||
    input.address.trim().length < 6 ||
    typeof input.deliveryTime !== "string" ||
    !input.deliveryTime ||
    typeof input.notes !== "string" ||
    input.notes.length > 300
  ) {
    return null;
  }
  return {
    customerName: input.customerName.trim(),
    phone: input.phone.trim(),
    address: input.address.trim(),
    deliveryTime: input.deliveryTime,
    notes: input.notes.trim(),
  };
}
