create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role, tenant_id)
  values (new.id, new.email, 'parent', null);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
