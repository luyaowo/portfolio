-- page_reactions（留言板的表情反馈）
--
-- 注意：这份 DDL 是从 src/lib/server/guestbook.ts 的用法反推出来的，不是从线上库导出的。
-- 原表当初直接在 Supabase 面板里手建，仓库里一直没有建表语句。
-- 项目恢复后应当对照线上实际结构核对一遍（字段类型、约束名可能有出入），再以线上为准修正本文件。
--
-- 反推依据：
--   listPageReactions()      select('emoji')                         → 按 emoji 分组计数
--   togglePageReaction()     select('id').eq('emoji').eq('ip_hash')  → id 主键，emoji + ip_hash 组合唯一
--                            delete().eq('id')
--                            insert({ emoji, ip_hash })              → 其余字段必须有默认值

create extension if not exists pgcrypto;

create table if not exists public.page_reactions (
  id uuid primary key default gen_random_uuid(),
  emoji text not null,
  ip_hash text not null,
  created_at timestamptz not null default now(),
  constraint page_reactions_emoji_check
    check (emoji in ('thumbsup', 'laugh', 'hooray', 'heart', 'rocket', 'eyes')),
  constraint page_reactions_emoji_ip_hash_key
    unique (emoji, ip_hash)
);

create index if not exists page_reactions_emoji_idx
  on public.page_reactions (emoji);

alter table public.page_reactions enable row level security;

revoke all on table public.page_reactions from anon;
revoke all on table public.page_reactions from authenticated;
