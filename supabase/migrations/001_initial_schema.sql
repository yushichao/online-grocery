create extension if not exists pgcrypto;

create table if not exists public.products (
  id text primary key,
  name text not null,
  name_ja text not null default '',
  description text not null default '',
  price integer not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  category_slug text not null check (
    category_slug in (
      'vegetables',
      'frozen-food',
      'snacks',
      'drinks',
      'instant-noodles',
      'seasonings'
    )
  ),
  unit text not null,
  popular boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  customer_name text not null,
  phone text not null,
  address text not null,
  delivery_time text not null default '',
  notes text not null default '',
  total integer not null check (total >= 0),
  status text not null default 'pending' check (
    status in ('pending', 'confirmed', 'preparing', 'completed', 'cancelled')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id text not null references public.orders(id) on delete cascade,
  product_id text references public.products(id) on delete set null,
  product_name text not null,
  product_name_ja text not null default '',
  unit text not null,
  unit_price integer not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  subtotal integer not null check (subtotal >= 0)
);

create index if not exists orders_created_at_idx
  on public.orders (created_at desc);
create index if not exists order_items_order_id_idx
  on public.order_items (order_id);

create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role = 'admin'),
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.admin_profiles enable row level security;

drop policy if exists "Public can view active products" on public.products;
create policy "Public can view active products"
on public.products for select
to anon, authenticated
using (active = true);

drop policy if exists "Admins can manage products" on public.products;
create policy "Admins can manage products"
on public.products for all
to authenticated
using (
  exists (
    select 1 from public.admin_profiles
    where id = (select auth.uid()) and role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.admin_profiles
    where id = (select auth.uid()) and role = 'admin'
  )
);

drop policy if exists "Admins can view orders" on public.orders;
create policy "Admins can view orders"
on public.orders for select
to authenticated
using (
  exists (
    select 1 from public.admin_profiles
    where id = (select auth.uid()) and role = 'admin'
  )
);

drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders"
on public.orders for update
to authenticated
using (
  exists (
    select 1 from public.admin_profiles
    where id = (select auth.uid()) and role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.admin_profiles
    where id = (select auth.uid()) and role = 'admin'
  )
);

drop policy if exists "Admins can view order items" on public.order_items;
create policy "Admins can view order items"
on public.order_items for select
to authenticated
using (
  exists (
    select 1 from public.admin_profiles
    where id = (select auth.uid()) and role = 'admin'
  )
);

drop policy if exists "Users can view their admin profile" on public.admin_profiles;
create policy "Users can view their admin profile"
on public.admin_profiles for select
to authenticated
using (id = (select auth.uid()));
