import type { CategorySlug } from "@/lib/types";

const categoryGradients: Record<CategorySlug, string> = {
  vegetables: "from-emerald-100 via-green-50 to-teal-100",
  "frozen-food": "from-sky-100 via-blue-50 to-indigo-100",
  snacks: "from-amber-100 via-orange-50 to-yellow-100",
  drinks: "from-rose-100 via-pink-50 to-red-100",
  "instant-noodles": "from-orange-100 via-amber-50 to-yellow-100",
  seasonings: "from-stone-200 via-neutral-100 to-stone-100",
};

const categoryEmojis: Record<CategorySlug, string> = {
  vegetables: "🥬",
  "frozen-food": "🥟",
  snacks: "🍪",
  drinks: "🥤",
  "instant-noodles": "🍜",
  seasonings: "🧂",
};

export function getProductGradient(categorySlug: CategorySlug): string {
  return categoryGradients[categorySlug];
}

export function getProductEmoji(categorySlug: CategorySlug): string {
  return categoryEmojis[categorySlug];
}
