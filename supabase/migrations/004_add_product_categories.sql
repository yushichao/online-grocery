alter table public.products
drop constraint if exists products_category_slug_check;

alter table public.products
add constraint products_category_slug_check check (
  category_slug in (
    'vegetables',
    'frozen-food',
    'snacks',
    'drinks',
    'instant-noodles',
    'seasonings',
    'seafood',
    'fruits',
    'prepared-food'
  )
);
