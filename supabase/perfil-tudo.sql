-- PERFIL COMPLETO, na ordem certa. Pode rodar mais de uma vez, sem apagar dados.
-- Cole tudo no SQL Editor do Supabase e clique em Run.

-- ===== perfil-extras =====
-- Rode no SQL Editor DEPOIS do perfil.sql (pode rodar mais de uma vez)
alter table public.profiles add column if not exists fav_ship text
  check (char_length(fav_ship) <= 40);
alter table public.profiles add column if not exists fav_character text
  check (char_length(fav_character) <= 40);
alter table public.profiles add column if not exists x_handle text
  check (x_handle ~ '^[A-Za-z0-9_]{1,15}$');
alter table public.profiles add column if not exists fav_aus integer[] not null default '{}'
  check (cardinality(fav_aus) <= 3);

-- ===== perfil-publico =====
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

-- ===== perfil-personalizar =====
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

-- ===== perfil-cores =====
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

-- ===== perfil-busca =====
-- Rode no SQL Editor DEPOIS do perfil-cores.sql (pode rodar mais de uma vez)
-- Busca perfis PÚBLICOS pelo nome de usuário (mínimo 2 letras, no máximo 8 resultados).
-- Só aparecem perfis que a pessoa marcou como públicos; devolve apenas usuário, nome e foto.
create or replace function public.search_public_profiles(p_q text)
returns table (slug text, display_name text, avatar_path text)
language sql stable security definer set search_path = '' as $$
  select p.slug, p.display_name, p.avatar_path
  from public.profiles p
  where p.is_public and p.slug is not null and length(p_q) >= 2
    and strpos(p.slug, lower(p_q)) > 0
  order by (p.slug = lower(p_q)) desc, (strpos(p.slug, lower(p_q)) = 1) desc, p.slug
  limit 8
$$;
revoke all on function public.search_public_profiles(text) from public;
grant execute on function public.search_public_profiles(text) to anon, authenticated;

-- ===== perfil-listas =====
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

-- ===== perfil-destaque =====
-- Rode no SQL Editor DEPOIS do perfil-listas.sql (pode rodar mais de uma vez)
-- Link no perfil + destaque (vídeo ou GIF). Este arquivo recria a função get_public_profile COMPLETA,
-- então se algum dia rodar outro arquivo de perfil de novo, rode este por último.
alter table public.profiles add column if not exists link_url text
  check (link_url is null or (char_length(link_url) <= 300 and link_url ~* '^https?://[^[:space:]]{3,290}$'));
alter table public.profiles add column if not exists link_label text check (char_length(link_label) <= 30);
alter table public.profiles add column if not exists media_path text
  check (media_path is null or media_path like user_id::text || '/%');

-- o bucket passa a aceitar vídeo (MP4/WebM) e o limite sobe para 15 MB (imagens seguem em 8 MB pelo site)
update storage.buckets
   set file_size_limit = 15728640,
       allowed_mime_types = array['image/png','image/jpeg','image/webp','image/gif','video/mp4','video/webm']
 where id = 'profile-media';
notify pgrst, 'reload schema';

drop function if exists public.get_public_profile(text);
create function public.get_public_profile(p_slug text)
returns table (slug text, display_name text, bio text, avatar_path text, banner_path text,
               fav_ship text, fav_character text, x_handle text, fav_aus integer[], created_at timestamptz,
               about text, about_path text, bg_path text, theme_color text, theme_colors jsonb,
               badge_text text, badge_author text, spotify text, shared_lists jsonb, identifies text[],
               link_url text, link_label text, media_path text)
language sql stable security definer set search_path = '' as $$
  select p.slug, p.display_name, p.bio, p.avatar_path, p.banner_path,
         p.fav_ship, p.fav_character, p.x_handle, p.fav_aus, p.created_at,
         p.about, p.about_path, p.bg_path, p.theme_color, p.theme_colors,
         p.badge_text, p.badge_author, p.spotify, p.shared_lists, p.identifies,
         p.link_url, p.link_label, p.media_path
  from public.profiles p
  where p.is_public and p.slug = lower(p_slug)
  limit 1
$$;
revoke all on function public.get_public_profile(text) from public;
grant execute on function public.get_public_profile(text) to anon, authenticated;

notify pgrst, 'reload schema';
