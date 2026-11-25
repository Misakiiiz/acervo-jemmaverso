-- (pode ser executado mais de uma vez sem erro)
-- Rode este arquivo inteiro no Supabase: SQL Editor > New query > Run

create table if not exists public.user_data (
  user_id    uuid not null default auth.uid()
             references auth.users (id) on delete cascade,
  key        text not null
             check (key in ('wenclair_favorites','wenclair_status','wenclair_ratings','wenclair_tags')),
  value      jsonb not null default '{}'::jsonb
             check (pg_column_size(value) < 200000),   -- limite de tamanho contra abuso
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

-- Segurança: cada usuário só enxerga e altera as PRÓPRIAS linhas
alter table public.user_data enable row level security;

drop policy if exists "ler proprios dados" on public.user_data;
create policy "ler proprios dados" on public.user_data
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "inserir proprios dados" on public.user_data;
create policy "inserir proprios dados" on public.user_data
  for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "atualizar proprios dados" on public.user_data;
create policy "atualizar proprios dados" on public.user_data
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "apagar proprios dados" on public.user_data;
create policy "apagar proprios dados" on public.user_data
  for delete to authenticated using ((select auth.uid()) = user_id);

-- updated_at sempre definido pelo servidor (evita problema de relógio do aparelho)
create or replace function public.set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists user_data_updated_at on public.user_data;
create trigger user_data_updated_at
  before insert or update on public.user_data
  for each row execute function public.set_updated_at();
