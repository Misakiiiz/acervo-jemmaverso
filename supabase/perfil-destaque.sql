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
