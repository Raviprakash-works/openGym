-- Create a table for public profiles and app state
create table if not exists profiles (
  id uuid references auth.users not null primary key,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;

-- Create policies so users can only access their own data
create policy "Users can view own profile."
  on profiles for select
  using ( auth.uid() = id );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Set up a trigger to automatically create a profile record when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, state)
  values (new.id, '{}'::jsonb);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
