-- Rode no SQL Editor DEPOIS do perfil-publico.sql (pode rodar mais de uma vez)

-- 1) Usuário disponível? (usado na tela de criar conta)
create or replace function public.username_available(p_user text)
returns boolean language sql stable security definer set search_path = '' as $$
  select not exists (select 1 from public.profiles where slug = lower(p_user))
$$;

-- 2) Entrar com NOME DE USUÁRIO: devolve o e-mail ligado a esse usuário
create or replace function public.login_email(p_user text)
returns text language sql stable security definer set search_path = '' as $$
  select u.email::text from public.profiles p join auth.users u on u.id = p.user_id
  where p.slug = lower(p_user) limit 1
$$;
revoke all on function public.username_available(text), public.login_email(text) from public;
grant execute on function public.username_available(text), public.login_email(text) to anon, authenticated;

-- 3) Ao criar conta, já cria o perfil com o usuário escolhido (nunca bloqueia o cadastro)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare s text := lower(new.raw_user_meta_data ->> 'username');
begin
  if s ~ '^[a-z0-9_]{3,20}$' then
    begin
      insert into public.profiles (user_id, slug, display_name) values (new.id, s, s) on conflict do nothing;
    exception when others then null;
    end;
  end if;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();
