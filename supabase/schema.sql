-- Supabase schema for Quiz Trainer application
create extension if not exists "pgcrypto" with schema public;

create table if not exists public.quiz_sets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quiz_words (
  id uuid primary key default gen_random_uuid(),
  set_id uuid not null references public.quiz_sets(id) on delete cascade,
  question text not null,
  answer text not null,
  hint text,
  proficiency integer not null default 0 check (proficiency between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quiz_sessions (
  id uuid primary key default gen_random_uuid(),
  set_ids uuid[] not null check (array_length(set_ids, 1) > 0),
  mode text not null,
  total_questions integer not null check (total_questions > 0),
  correct_answers integer not null check (correct_answers >= 0 and correct_answers <= total_questions),
  accuracy numeric(5,2) not null check (accuracy >= 0 and accuracy <= 100),
  created_at timestamptz not null default now()
);

create index if not exists quiz_words_set_id_idx on public.quiz_words(set_id);
create index if not exists quiz_sessions_created_at_idx on public.quiz_sessions(created_at desc);

alter table public.quiz_sets enable row level security;
alter table public.quiz_words enable row level security;
alter table public.quiz_sessions enable row level security;

drop policy if exists "Allow anon select on quiz_sets" on public.quiz_sets;
create policy "Allow anon select on quiz_sets"
  on public.quiz_sets
  for select
  using (true);

drop policy if exists "Allow anon insert on quiz_sets" on public.quiz_sets;
create policy "Allow anon insert on quiz_sets"
  on public.quiz_sets
  for insert
  with check (true);

drop policy if exists "Allow anon update on quiz_sets" on public.quiz_sets;
create policy "Allow anon update on quiz_sets"
  on public.quiz_sets
  for update
  using (true)
  with check (true);

drop policy if exists "Allow anon delete on quiz_sets" on public.quiz_sets;
create policy "Allow anon delete on quiz_sets"
  on public.quiz_sets
  for delete
  using (true);

drop policy if exists "Allow anon select on quiz_words" on public.quiz_words;
create policy "Allow anon select on quiz_words"
  on public.quiz_words
  for select
  using (true);

drop policy if exists "Allow anon insert on quiz_words" on public.quiz_words;
create policy "Allow anon insert on quiz_words"
  on public.quiz_words
  for insert
  with check (true);

drop policy if exists "Allow anon update on quiz_words" on public.quiz_words;
create policy "Allow anon update on quiz_words"
  on public.quiz_words
  for update
  using (true)
  with check (true);

drop policy if exists "Allow anon delete on quiz_words" on public.quiz_words;
create policy "Allow anon delete on quiz_words"
  on public.quiz_words
  for delete
  using (true);

drop policy if exists "Allow anon select on quiz_sessions" on public.quiz_sessions;
create policy "Allow anon select on quiz_sessions"
  on public.quiz_sessions
  for select
  using (true);

drop policy if exists "Allow anon insert on quiz_sessions" on public.quiz_sessions;
create policy "Allow anon insert on quiz_sessions"
  on public.quiz_sessions
  for insert
  with check (true);

drop policy if exists "Allow anon delete on quiz_sessions" on public.quiz_sessions;
create policy "Allow anon delete on quiz_sessions"
  on public.quiz_sessions
  for delete
  using (true);
