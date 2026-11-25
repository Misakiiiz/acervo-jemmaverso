-- COMENTÁRIOS NO PERFIL. Rode no SQL Editor DEPOIS do perfil-tudo.sql (pode rodar mais de uma vez).
-- Regras:
--  * Só quem está logado comenta, e só em perfil PÚBLICO cuja dona ligou "permitir comentários" (desligado por padrão).
--  * Máx. 300 caracteres e no máx. 3 comentários por minuto por pessoa (anti-spam).
--  * Só o autor apaga o próprio comentário; a dona do perfil apaga qualquer um no perfil dela.
--  * Ninguém edita comentário (não existe função de edição).
--  * A dona pode bloquear alguém (apaga os comentários dessa pessoa ali e impede novos) e desbloquear depois.
-- As tabelas ficam fechadas (RLS sem policies): tudo passa pelas funções abaixo.

alter table public.profiles add column if not exists allow_comments boolean not null default false;

create table if not exists public.profile_comments (
  id              uuid primary key default gen_random_uuid(),
  profile_user_id uuid not null references auth.users (id) on delete cascade,
  author_id       uuid not null references auth.users (id) on delete cascade,
  body            text not null check (char_length(body) between 1 and 300),
  created_at      timestamptz not null default now()
);
create index if not exists profile_comments_profile_idx on public.profile_comments (profile_user_id, created_at desc);
create index if not exists profile_comments_author_idx  on public.profile_comments (author_id, created_at desc);
alter table public.profile_comments enable row level security;

create table if not exists public.profile_comment_blocks (
  owner_id   uuid not null references auth.users (id) on delete cascade,
  blocked_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (owner_id, blocked_id)
);
alter table public.profile_comment_blocks enable row level security;

revoke all on public.profile_comments, public.profile_comment_blocks from anon, authenticated;

-- Lê os comentários de um perfil público (dados do autor: só nome e foto; link só se o perfil dele for público)
create or replace function public.get_profile_comments(p_slug text)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_owner uuid; v_allow boolean; v_me uuid := auth.uid();
begin
  select user_id, allow_comments into v_owner, v_allow
    from public.profiles where is_public and slug = lower(p_slug);
  if v_owner is null or not v_allow then
    return jsonb_build_object('allowed', false, 'items', '[]'::jsonb);
  end if;
  return jsonb_build_object(
    'allowed', true,
    'logged_in', v_me is not null,
    'is_owner', coalesce(v_me = v_owner, false),
    'blocked', exists (select 1 from public.profile_comment_blocks b where b.owner_id = v_owner and b.blocked_id = v_me),
    'items', coalesce((
      select jsonb_agg(to_jsonb(x) order by x.created_at desc) from (
        select c.id, c.body, c.created_at, ap.display_name, ap.avatar_path,
               case when ap.is_public then ap.slug end as slug,
               coalesce(c.author_id = v_me or v_owner = v_me, false) as can_delete
        from public.profile_comments c
        left join public.profiles ap on ap.user_id = c.author_id
        where c.profile_user_id = v_owner
        order by c.created_at desc limit 100
      ) x), '[]'::jsonb));
end $$;

create or replace function public.add_profile_comment(p_slug text, p_body text)
returns void language plpgsql security definer set search_path = '' as $$
declare v_owner uuid; v_allow boolean; v_me uuid := auth.uid(); v_body text := btrim(coalesce(p_body, ''));
begin
  if v_me is null then raise exception 'Entre na sua conta para comentar.'; end if;
  if char_length(v_body) < 1 then raise exception 'Escreva alguma coisa.'; end if;
  if char_length(v_body) > 300 then raise exception 'O comentário pode ter no máximo 300 caracteres.'; end if;
  select user_id, allow_comments into v_owner, v_allow from public.profiles where is_public and slug = lower(p_slug);
  if v_owner is null or not v_allow then raise exception 'Este perfil não aceita comentários.'; end if;
  if exists (select 1 from public.profile_comment_blocks where owner_id = v_owner and blocked_id = v_me) then
    raise exception 'Você não pode comentar neste perfil.';
  end if;
  if (select count(*) from public.profile_comments where author_id = v_me and created_at > now() - interval '1 minute') >= 3 then
    raise exception 'Calma! Espere um minutinho antes de comentar de novo.';
  end if;
  insert into public.profile_comments (profile_user_id, author_id, body) values (v_owner, v_me, v_body);
end $$;

create or replace function public.delete_profile_comment(p_id uuid)
returns void language sql security definer set search_path = '' as $$
  delete from public.profile_comments where id = p_id and (author_id = auth.uid() or profile_user_id = auth.uid())
$$;

-- A dona do perfil bloqueia o autor de um comentário (e apaga os comentários dele no perfil dela)
create or replace function public.block_commenter(p_comment_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare v_author uuid;
begin
  select author_id into v_author from public.profile_comments where id = p_comment_id and profile_user_id = auth.uid();
  if v_author is null or v_author = auth.uid() then return; end if;
  insert into public.profile_comment_blocks (owner_id, blocked_id) values (auth.uid(), v_author) on conflict do nothing;
  delete from public.profile_comments where profile_user_id = auth.uid() and author_id = v_author;
end $$;

create or replace function public.get_blocked_commenters()
returns table (blocked_id uuid, display_name text, slug text)
language sql stable security definer set search_path = '' as $$
  select b.blocked_id, p.display_name, case when p.is_public then p.slug end
  from public.profile_comment_blocks b left join public.profiles p on p.user_id = b.blocked_id
  where b.owner_id = auth.uid() order by b.created_at desc
$$;

create or replace function public.unblock_commenter(p_blocked uuid)
returns void language sql security definer set search_path = '' as $$
  delete from public.profile_comment_blocks where owner_id = auth.uid() and blocked_id = p_blocked
$$;

revoke all on function public.get_profile_comments(text), public.add_profile_comment(text, text), public.delete_profile_comment(uuid),
  public.block_commenter(uuid), public.get_blocked_commenters(), public.unblock_commenter(uuid) from public;
grant execute on function public.get_profile_comments(text) to anon, authenticated;
grant execute on function public.add_profile_comment(text, text), public.delete_profile_comment(uuid), public.block_commenter(uuid),
  public.get_blocked_commenters(), public.unblock_commenter(uuid) to authenticated;
