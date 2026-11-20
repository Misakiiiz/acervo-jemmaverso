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
