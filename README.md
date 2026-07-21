# Online Grocery

An online grocery store built with Next.js 16, Supabase, and PostgreSQL. Customers can browse products, add items to cart, and place orders. Admins can log in to the backend to view orders, update order status, and manage products, prices, and inventory.

## Features

- Product catalog, categories, details, and local shopping cart
- Server-side order creation, price verification, and atomic inventory deduction
- Supabase PostgreSQL for products, orders, and order items persistence
- Supabase Auth for admin login
- Admin backend to view orders and update status
- Admin backend to create, edit, publish/unpublish products, and manage prices and inventory
- Product image upload with automatic conversion to 1400px max width, 300KB max size, WebP format
- Automatic cleanup of old images in Supabase Storage when updating or removing product images
- Database Row Level Security (RLS) policies

Discounts, coupons, and shipping fee calculations are not yet enabled. Order total currently includes only product amounts.

## Environment Variables

Configure in `.env.local`:

```dotenv
DATABASE_URL=postgresql://...
MIGRATION_DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

- `DATABASE_URL`: Connection for the running app, recommended to use Transaction pooler with prepared statements disabled.
- `MIGRATION_DATABASE_URL`: Connection for migration scripts, recommended Session pooler or Direct connection.
- `.env.local` is gitignored; never commit database passwords.

## Quick Start

```bash
npm install
npm run db:migrate
npm run dev
```

Open `http://localhost:3000`.

## Create Admin User

First, create an email/password user in Supabase Dashboard at `Authentication > Users`, then run:

```bash
npm run db:make-admin -- admin@example.com
```

Then visit `http://localhost:3000/admin/login` to log in.

## Common Commands

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Data Storage

- Products and orders are stored in Supabase PostgreSQL.
- Product images are stored in the public Supabase Storage `product-images` bucket; only admins can upload and delete.
- Shopping cart is stored in browser `localStorage`.
- Order API accepts only product IDs and quantities; prices, publish status, and inventory are verified server-side.
- Online payment integration not yet implemented.

---

[中文文档](docs/README.zh.md)
