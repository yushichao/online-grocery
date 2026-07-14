export function formatPrice(price: number): string {
  return `¥${price.toLocaleString("ja-JP")}`;
}

export function calculateCartTotal(
  items: { product: { price: number }; quantity: number }[],
): number {
  return items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );
}
