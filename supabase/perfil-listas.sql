-- Rode no SQL Editor DEPOIS do perfil-busca.sql (pode rodar mais de uma vez)
-- shared_lists: listas (Quero ler / Lendo / Concluídas) que a pessoa escolheu mostrar no perfil público
-- identifies: "Me identifico com" (até 5 personagens)
alter table public.profiles add column if not exists shared_lists jsonb
  check (shared_lists is null or pg_column_size(shared_lists) < 30000);
alter table public.profiles add column if not exists identifies text[] not null default '{}'
  check (cardinality(identifies) <= 5);
notify pgrst, 'reload schema';

drop function if exists public.get_public_profile(text);
create function public.get_public_profile(p_slug text)
returns table (slug text, display_name text, bio text, avatar_path text, banner_path text,
               fav_ship text, fav_character text, x_handle text, fav_aus integer[], created_at timestamptz,
               about text, about_path text, bg_path text, theme_color text, theme_colors jsonb,
               badge_text text, badge_author text, spotify text, shared_lists jsonb, identifies text[])
language sql stable security definer set search_path = '' as $$
  select p.slug, p.display_name, p.bio, p.avatar_path, p.banner_path,
         p.fav_ship, p.fav_character, p.x_handle, p.fav_aus, p.created_at,
         p.about, p.about_path, p.bg_path, p.theme_color, p.theme_colors,
         p.badge_text, p.badge_author, p.spotify, p.shared_lists, p.identifies
  from public.profiles p
  where p.is_public and p.slug = lower(p_slug)
  limit 1
$$;
revoke all on function public.get_public_profile(text) from public;
grant execute on function public.get_public_profile(text) to anon, authenticated;
