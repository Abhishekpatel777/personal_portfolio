-- Run this once in Supabase Dashboard > SQL Editor.
create table if not exists public.portfolio_content (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.portfolio_content enable row level security;

drop policy if exists "Portfolio is publicly readable" on public.portfolio_content;
create policy "Portfolio is publicly readable"
on public.portfolio_content for select
to anon, authenticated
using (true);

drop policy if exists "Signed-in admin can create portfolio content" on public.portfolio_content;
create policy "Signed-in admin can create portfolio content"
on public.portfolio_content for insert
to authenticated
with check (true);

drop policy if exists "Signed-in admin can update portfolio content" on public.portfolio_content;
create policy "Signed-in admin can update portfolio content"
on public.portfolio_content for update
to authenticated
using (true)
with check (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-files',
  'portfolio-files',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public portfolio files are readable" on storage.objects;
create policy "Public portfolio files are readable"
on storage.objects for select
to public
using (bucket_id = 'portfolio-files');

drop policy if exists "Admin can upload portfolio files" on storage.objects;
create policy "Admin can upload portfolio files"
on storage.objects for insert
to authenticated
with check (bucket_id = 'portfolio-files' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Admin can update own portfolio files" on storage.objects;
create policy "Admin can update own portfolio files"
on storage.objects for update
to authenticated
using (bucket_id = 'portfolio-files' and owner_id = auth.uid()::text)
with check (bucket_id = 'portfolio-files' and owner_id = auth.uid()::text);

drop policy if exists "Admin can delete own portfolio files" on storage.objects;
create policy "Admin can delete own portfolio files"
on storage.objects for delete
to authenticated
using (bucket_id = 'portfolio-files' and owner_id = auth.uid()::text);

-- Public visitor ratings. Visitors can submit once per locally generated token.
-- Ratings and aggregate scores are readable; feedback is stored privately for the admin.
create table if not exists public.visitor_ratings (
  id bigint generated always as identity primary key,
  visitor_token uuid not null unique,
  score smallint not null check (score between 1 and 5),
  feedback text check (feedback is null or char_length(feedback) <= 280),
  created_at timestamptz not null default now()
);

alter table public.visitor_ratings enable row level security;

revoke all on table public.visitor_ratings from anon, authenticated;
grant select (score) on table public.visitor_ratings to anon, authenticated;
grant insert (visitor_token, score, feedback) on table public.visitor_ratings to anon, authenticated;
grant usage, select on sequence public.visitor_ratings_id_seq to anon, authenticated;

drop policy if exists "Visitors can read rating scores" on public.visitor_ratings;
create policy "Visitors can read rating scores"
on public.visitor_ratings for select
to anon, authenticated
using (true);

drop policy if exists "Visitors can submit a valid rating" on public.visitor_ratings;
create policy "Visitors can submit a valid rating"
on public.visitor_ratings for insert
to anon, authenticated
with check (
  score between 1 and 5
  and (feedback is null or char_length(feedback) <= 280)
);
