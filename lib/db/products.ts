import "server-only";
import { sql } from "@/lib/db/client";
import type { CategorySlug, Product } from "@/lib/types";

interface ProductRow {
  id: string;
  name: string;
  name_ja: string;
  description: string;
  price: number;
  stock: number;
  category_slug: CategorySlug;
  unit: string;
  popular: boolean;
  active: boolean;
}

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    nameJa: row.name_ja,
    description: row.description,
    price: row.price,
    stock: row.stock,
    categorySlug: row.category_slug,
    unit: row.unit,
    popular: row.popular,
    active: row.active,
  };
}

export async function listPublicProducts(): Promise<Product[]> {
  const rows = await sql<ProductRow[]>`
    select id, name, name_ja, description, price, stock, category_slug,
      unit, popular, active
    from public.products
    where active = true
    order by created_at, id
  `;
  return rows.map(mapProduct);
}

export async function listAllProducts(): Promise<Product[]> {
  const rows = await sql<ProductRow[]>`
    select id, name, name_ja, description, price, stock, category_slug,
      unit, popular, active
    from public.products
    order by created_at, id
  `;
  return rows.map(mapProduct);
}

export async function createProduct(
  product: Omit<Product, "id">,
): Promise<Product> {
  const id = `prod-${crypto.randomUUID()}`;
  const [row] = await sql<ProductRow[]>`
    insert into public.products (
      id, name, name_ja, description, price, stock, category_slug,
      unit, popular, active
    ) values (
      ${id}, ${product.name}, ${product.nameJa}, ${product.description},
      ${product.price}, ${product.stock}, ${product.categorySlug},
      ${product.unit}, ${Boolean(product.popular)}, ${product.active}
    )
    returning id, name, name_ja, description, price, stock, category_slug,
      unit, popular, active
  `;
  return mapProduct(row);
}

export async function updateProduct(
  id: string,
  product: Omit<Product, "id">,
): Promise<Product | null> {
  const [row] = await sql<ProductRow[]>`
    update public.products set
      name = ${product.name},
      name_ja = ${product.nameJa},
      description = ${product.description},
      price = ${product.price},
      stock = ${product.stock},
      category_slug = ${product.categorySlug},
      unit = ${product.unit},
      popular = ${Boolean(product.popular)},
      active = ${product.active}
    where id = ${id}
    returning id, name, name_ja, description, price, stock, category_slug,
      unit, popular, active
  `;
  return row ? mapProduct(row) : null;
}
