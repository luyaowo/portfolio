create extension if not exists pgcrypto;

create table if not exists public.guestbook_messages (
  id uuid primary key default gen_random_uuid(),
  nickname text not null,
  message text not null,
  status text not null default 'pending',
  is_hidden boolean not null default false,
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  ip_hash text,
  user_agent text,
  constraint guestbook_status_check
    check (status in ('pending', 'approved', 'rejected')),
  constraint guestbook_nickname_length_check
    check (char_length(nickname) between 1 and 24),
  constraint guestbook_message_length_check
    check (char_length(message) between 1 and 500)
);

create index if not exists guestbook_messages_status_created_at_idx
  on public.guestbook_messages (status, created_at desc);

create index if not exists guestbook_messages_ip_hash_created_at_idx
  on public.guestbook_messages (ip_hash, created_at desc);

alter table public.guestbook_messages enable row level security;

revoke all on table public.guestbook_messages from anon;
revoke all on table public.guestbook_messages from authenticated;
