-- Rode DEPOIS do perfil-publico.sql (pode rodar mais de uma vez)
alter table public.profiles add column if not exists about text check (char_length(about) <= 600);
alter table public.profiles add column if not exists about_path text check (about_path is null or about_path like user_id::text || '/%');
alter table public.profiles add column if not exists bg_path text check (bg_path is null or bg_path like user_id::text || '/%');
alter table public.profiles add column if not exists theme_color text check (theme_color ~ '^#[0-9a-fA-F]{6}$');
alter table public.profiles add column if not exists badge_text text check (char_length(badge_text) <= 24);
alter table public.profiles add column if not exists badge_author text check (char_length(badge_author) <= 40);
alter table public.profiles add column if not exists spotify text check (spotify ~ '^(track|album|playlist|episode|show|artist)/[A-Za-z0-9]{10,30}$');

-- o tipo de retorno mudou, então a função precisa ser recriada
drop function if exists public.get_public_profile(text);
create function public.get_public_profile(p_slug text)
returns table (slug text, display_name text, bio text, avatar_path text, banner_path text,
               fav_ship text, fav_character text, x_handle text, fav_aus integer[], created_at timestamptz,
               about text, about_path text, bg_path text, theme_color text,
               badge_text text, badge_author text, spotify text)
language sql stable security definer set search_path = '' as $$
  select p.slug, p.display_name, p.bio, p.avatar_path, p.banner_path,
         p.fav_ship, p.fav_character, p.x_handle, p.fav_aus, p.created_at,
         p.about, p.about_path, p.bg_path, p.theme_color, p.badge_text, p.badge_author, p.spotify
  from public.profiles p
  where p.is_public and p.slug = lower(p_slug)
  limit 1
$$;
revoke all on function public.get_public_profile(text) from public;
grant execute on function public.get_public_profile(text) to anon, authenticated;
