alter table public.products
add column if not exists image_path text;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
) values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins can view product images" on storage.objects;
create policy "Admins can view product images"
on storage.objects for select
to authenticated
using (
  bucket_id = 'product-images'
  and exists (
    select 1 from public.admin_profiles
    where id = (select auth.uid()) and role = 'admin'
  )
);

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'product-images'
  and exists (
    select 1 from public.admin_profiles
    where id = (select auth.uid()) and role = 'admin'
  )
);

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'product-images'
  and exists (
    select 1 from public.admin_profiles
    where id = (select auth.uid()) and role = 'admin'
  )
);
