-- Rode DEPOIS do schema.sql: SQL Editor > New query > Run

-- 1) Perfil (um por usuário). Guarda o CAMINHO do arquivo, não uma URL livre.
create table if not exists public.profiles (
  user_id      uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) <= 40),
  bio          text check (char_length(bio) <= 300),
  avatar_path  text check (avatar_path is null or avatar_path like user_id::text || '/%'),
  banner_path  text check (banner_path is null or banner_path like user_id::text || '/%'),
  updated_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "ler proprio perfil" on public.profiles;
create policy "ler proprio perfil" on public.profiles
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "criar proprio perfil" on public.profiles;
create policy "criar proprio perfil" on public.profiles
  for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "editar proprio perfil" on public.profiles;
create policy "editar proprio perfil" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "apagar proprio perfil" on public.profiles;
create policy "apagar proprio perfil" on public.profiles
  for delete to authenticated using ((select auth.uid()) = user_id);

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before insert or update on public.profiles
  for each row execute function public.set_updated_at();

-- 2) Bucket de imagens: leitura pública (para exibir), só imagens, máx. 8 MB (cabe GIF)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('profile-media', 'profile-media', true, 8388608,
        array['image/png','image/jpeg','image/webp','image/gif'])
on conflict (id) do nothing;

-- 3) Cada usuário só mexe na PRÓPRIA pasta (<user_id>/arquivo)
drop policy if exists "midia: ver propria pasta" on storage.objects;
create policy "midia: ver propria pasta" on storage.objects
  for select to authenticated
  using (bucket_id = 'profile-media' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists "midia: enviar na propria pasta" on storage.objects;
create policy "midia: enviar na propria pasta" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'profile-media' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists "midia: trocar na propria pasta" on storage.objects;
create policy "midia: trocar na propria pasta" on storage.objects
  for update to authenticated
  using (bucket_id = 'profile-media' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists "midia: apagar da propria pasta" on storage.objects;
create policy "midia: apagar da propria pasta" on storage.objects
  for delete to authenticated
  using (bucket_id = 'profile-media' and (storage.foldername(name))[1] = (select auth.uid())::text);
