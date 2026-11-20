-- Rode DEPOIS do perfil-personalizar.sql (pode rodar mais de uma vez)
alter table public.profiles add column if not exists theme_colors jsonb
  check (theme_colors is null or pg_column_size(theme_colors) < 1000);
notify pgrst, 'reload schema';

drop function if exists public.get_public_profile(text);
create function public.get_public_profile(p_slug text)
returns table (slug text, display_name text, bio text, avatar_path text, banner_path text,
               fav_ship text, fav_character text, x_handle text, fav_aus integer[], created_at timestamptz,
               about text, about_path text, bg_path text, theme_color text, theme_colors jsonb,
               badge_text text, badge_author text, spotify text)
language sql stable security definer set search_path = '' as $$
  select p.slug, p.display_name, p.bio, p.avatar_path, p.banner_path,
         p.fav_ship, p.fav_character, p.x_handle, p.fav_aus, p.created_at,
         p.about, p.about_path, p.bg_path, p.theme_color, p.theme_colors,
         p.badge_text, p.badge_author, p.spotify
  from public.profiles p
  where p.is_public and p.slug = lower(p_slug)
  limit 1
$$;
revoke all on function public.get_public_profile(text) from public;
grant execute on function public.get_public_profile(text) to anon, authenticated;
