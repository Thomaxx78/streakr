-- Table des habitudes
create table public.habits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  category text not null default 'general',
  icon text not null default '🎯',
  color text not null default '#FF6B35',
  xp_per_check int not null default 10,
  is_archived boolean not null default false,
  created_at timestamptz default now() not null
);

-- Table des check-ins quotidiens
create table public.check_ins (
  id uuid default gen_random_uuid() primary key,
  habit_id uuid references public.habits(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  checked_at date not null default current_date,
  created_at timestamptz default now() not null,
  unique(habit_id, checked_at)
);

-- Table profils utilisateurs
create table public.user_profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text not null,
  avatar_url text,
  xp int not null default 0,
  level int not null default 1,
  active_title text,
  created_at timestamptz default now() not null
);

-- RLS (Row Level Security)
alter table public.habits enable row level security;
alter table public.check_ins enable row level security;
alter table public.user_profiles enable row level security;

create policy "Users can CRUD their own habits" on public.habits
  for all using (auth.uid() = user_id);

create policy "Users can CRUD their own check_ins" on public.check_ins
  for all using (auth.uid() = user_id);

create policy "Users can read/update their own profile" on public.user_profiles
  for all using (auth.uid() = id);

-- Trigger: crée un profil à l'inscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, username)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', 'Streaker'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Trigger: met à jour l'XP lors des check-ins
create or replace function public.update_xp_on_checkin()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    update public.user_profiles up
    set xp = up.xp + h.xp_per_check,
        level = floor((up.xp + h.xp_per_check) / 100) + 1
    from public.habits h
    where h.id = new.habit_id and up.id = new.user_id;
  elsif tg_op = 'DELETE' then
    update public.user_profiles up
    set xp = greatest(0, up.xp - h.xp_per_check),
        level = floor(greatest(0, up.xp - h.xp_per_check) / 100) + 1
    from public.habits h
    where h.id = old.habit_id and up.id = old.user_id;
  end if;
  return coalesce(new, old);
end;
$$ language plpgsql security definer;

create trigger on_checkin_change
  after insert or delete on public.check_ins
  for each row execute function public.update_xp_on_checkin();
