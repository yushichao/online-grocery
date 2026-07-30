# Online Grocery

A mobile-friendly online grocery store built with Next.js 16, React 19,
Supabase, and PostgreSQL. Customers can browse products, add items to their
cart, submit an order, and view static payment QR codes. Administrators can
manage orders, products, inventory, and product images from the protected
backend.

[中文说明](docs/README.zh.md)

## Current Features

### Customer

- Browse, search, and filter products by category
- View product details and popular products
- Store the shopping cart locally in the browser
- Submit orders without selecting a delivery time
- Server-side price, availability, and inventory validation
- Atomic inventory deduction when an order is created
- Order success page with static PayPay and WeChat/Alipay QR-code images

### Administrator

- Supabase email/password authentication with an administrator-role check
- Visible processing and error states during login
- View orders and filter them by status with live counts
- Change order status: pending, confirmed, processing, completed, or cancelled
- View products and filter them by category with live counts
- Create and edit products, prices, inventory, categories, and availability
- Upload HEIC/HEIF, JPEG, PNG, and WebP product images
- Resize images to a maximum edge of 1400px and compress them to 300KB or less
- Store optimized product images as WebP in Supabase Storage
- Remove the previous Storage object when a product image is replaced

Discounts, coupons, shipping-fee calculation, delivery-time selection, and
online payment processing are not included. The payment images are instructions
for customers; the application does not verify payment automatically.

## Requirements

- Node.js 22
- npm
- A Supabase project with PostgreSQL, Authentication, and Storage

Node.js 20 and earlier are not supported by this project.

## Environment Variables

Create `.env.local` in the project root:

```dotenv
DATABASE_URL=postgresql://postgres.project-ref:YOUR_PASSWORD@YOUR_POOLER_HOST:6543/postgres
MIGRATION_DATABASE_URL=postgresql://postgres.project-ref:YOUR_PASSWORD@YOUR_SESSION_POOLER_HOST:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

- `DATABASE_URL` is used by the running application. Supabase Transaction
  pooler is recommended for local and Vercel runtimes.
- `MIGRATION_DATABASE_URL` is optional. The migration and administrator scripts
  use it when present and otherwise fall back to `DATABASE_URL`. Session pooler
  or Direct connection is recommended for migrations.
- If the database password contains special URL characters, use the
  URL-encoded password in the connection string.
- `.env.local` is ignored by Git. Never commit passwords, private keys, or
  production connection strings.

For Vercel, add the required variables in **Project Settings → Environment
Variables**. Select **Production and Preview** when deploying those
environments, save the variables, and redeploy. Local `.env.local` values are
not uploaded to Vercel.

## Local Setup

```bash
npm install
npm run db:migrate
npm run dev
```

Open:

- Store: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin/login`

`npm run db:migrate` applies each SQL file in `supabase/migrations` once and
records it in `public.app_migrations`. Run it after pulling new migrations.

## Create an Administrator

1. Open **Supabase Dashboard → Authentication → Users**.
2. Create an email/password user.
3. Grant that existing user administrator access:

```bash
npm run db:make-admin -- admin@example.com
```

4. Log in at `http://localhost:3000/admin/login` with the same email and
   password.

The script does not create an Authentication user and does not set a password.
If it reports `Auth user not found`, create the user in Supabase first. If the
password is lost, reset it from Supabase Authentication.

## Payment QR Codes

The order-success page reads two static files:

```text
public/payment-codes/paypay.png
public/payment-codes/wechat-alipay.png
```

Replace these files with the shop's PNG images while keeping the same filenames.
The images may include the PayPay, WeChat Pay, or Alipay labels directly.
Restarting the app is normally unnecessary during local development; redeploy
after committing replacements for production.

## Product Image Storage

- Bucket: `product-images`
- Database/storage setup: `supabase/migrations/003_product_images.sql`
- Accepted source formats: HEIC/HEIF, JPEG, PNG, and WebP
- Maximum original file size: 10MB
- Maximum output edge: 1400px
- Maximum uploaded file size: 300KB
- Stored object format: WebP

HEIC decoding happens in the browser. Browsers without WebP canvas encoding may
temporarily send an optimized JPEG, which the server converts to WebP before
Storage upload.

## Database and Security

- Products, orders, and order items are stored in Supabase PostgreSQL.
- Product images are stored in the public `product-images` Storage bucket.
- Supabase Auth manages sessions; `public.admin_profiles` grants backend access.
- Admin API routes verify authentication and the administrator role.
- The order API accepts only product IDs and quantities. Product prices,
  availability, and stock are checked on the server.
- Row Level Security policies are installed by the migrations.
- The shopping cart is stored in browser `localStorage`.

## Commands

```bash
npm run dev
npm run lint
npx tsc --noEmit
npm run build
npm run start
npm run db:migrate
npm run db:make-admin -- admin@example.com
```

Use Node.js 22 when running these commands.
