-- Rode no SQL Editor DEPOIS do perfil.sql (pode rodar mais de uma vez)
alter table public.profiles add column if not exists fav_ship text
  check (char_length(fav_ship) <= 40);
alter table public.profiles add column if not exists fav_character text
  check (char_length(fav_character) <= 40);
alter table public.profiles add column if not exists x_handle text
  check (x_handle ~ '^[A-Za-z0-9_]{1,15}$');
alter table public.profiles add column if not exists fav_aus integer[] not null default '{}'
  check (cardinality(fav_aus) <= 3);
