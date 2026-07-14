import type { Category } from "@/lib/types";

export const categories: Category[] = [
  {
    id: "cat-vegetables",
    slug: "vegetables",
    name: "蔬菜",
    nameJa: "野菜",
    description: "新鲜蔬菜，每日配送",
    emoji: "🥬",
  },
  {
    id: "cat-frozen",
    slug: "frozen-food",
    name: "冷冻食品",
    nameJa: "冷凍食品",
    description: "水饺、包子、冷冻蔬菜",
    emoji: "🧊",
  },
  {
    id: "cat-snacks",
    slug: "snacks",
    name: "零食",
    nameJa: "お菓子",
    description: "饼干、糖果、坚果",
    emoji: "🍪",
  },
  {
    id: "cat-drinks",
    slug: "drinks",
    name: "饮料",
    nameJa: "飲料",
    description: "茶饮、果汁、豆浆",
    emoji: "🥤",
  },
  {
    id: "cat-noodles",
    slug: "instant-noodles",
    name: "方便面",
    nameJa: "インスタント麺",
    description: "康师傅、统一、今麦郎",
    emoji: "🍜",
  },
  {
    id: "cat-seasonings",
    slug: "seasonings",
    name: "调味料",
    nameJa: "調味料",
    description: "酱油、辣椒酱、香料",
    emoji: "🧂",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}
