-- Rode DEPOIS do perfil-extras.sql (pode rodar mais de uma vez)
-- ATENÇÃO: se rodar este arquivo de novo, rode o perfil-listas.sql POR ÚLTIMO (ele recria a função completa)
alter table public.profiles add column if not exists slug text;
alter table public.profiles add column if not exists is_public boolean not null default false;
alter table public.profiles add column if not exists created_at timestamptz not null default now();

alter table public.profiles drop constraint if exists profiles_slug_format;
alter table public.profiles add constraint profiles_slug_format
  check (slug is null or slug ~ '^[a-z0-9_]{3,20}$');
alter table public.profiles drop constraint if exists profiles_public_needs_slug;
alter table public.profiles add constraint profiles_public_needs_slug
  check (not is_public or slug is not null);
create unique index if not exists profiles_slug_key on public.profiles (slug);

-- Leitura pública SOMENTE por esta função: busca um perfil por usuário, só se for público,
-- e devolve só os campos de vitrine (nunca user_id, e-mail ou favoritos/notas).
-- Não dá para listar todos os perfis.
drop function if exists public.get_public_profile(text);
create function public.get_public_profile(p_slug text)
returns table (slug text, display_name text, bio text, avatar_path text, banner_path text,
               fav_ship text, fav_character text, x_handle text, fav_aus integer[], created_at timestamptz)
language sql stable security definer set search_path = '' as $$
  select p.slug, p.display_name, p.bio, p.avatar_path, p.banner_path,
         p.fav_ship, p.fav_character, p.x_handle, p.fav_aus, p.created_at
  from public.profiles p
  where p.is_public and p.slug = lower(p_slug)
  limit 1
$$;
revoke all on function public.get_public_profile(text) from public;
grant execute on function public.get_public_profile(text) to anon, authenticated;
