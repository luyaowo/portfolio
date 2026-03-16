import { createHash } from 'node:crypto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

type GuestbookRow = {
  id: string;
  nickname: string;
  message: string;
  created_at: string;
  approved_at: string | null;
};

type MessageInput = {
  nickname: string;
  message: string;
  ipHash: string | null;
  userAgent: string | null;
};

type EnvShape = ImportMetaEnv & {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  GUESTBOOK_IP_HASH_SALT?: string;
};

const TABLE_NAME = 'guestbook_messages';

function getEnv() {
  return import.meta.env as EnvShape;
}

function getSupabaseAdmin(): SupabaseClient | null {
  const env = getEnv();
  const url = env.SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function isGuestbookConfigured() {
  return Boolean(getSupabaseAdmin());
}

export function normalizeNickname(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

export function normalizeMessage(value: string) {
  return value.replace(/\r\n/g, '\n').trim();
}

export function validateGuestbookInput(nickname: string, message: string) {
  if (nickname.length < 1 || nickname.length > 24) {
    throw new Error('昵称长度需要在 1 到 24 个字符之间。');
  }

  if (message.length < 1 || message.length > 500) {
    throw new Error('留言长度需要在 1 到 500 个字符之间。');
  }
}

export function hashIpAddress(ipAddress: string | null) {
  if (!ipAddress) {
    return null;
  }

  const env = getEnv();
  const salt = env.GUESTBOOK_IP_HASH_SALT ?? 'guestbook-default-salt';

  return createHash('sha256').update(`${salt}:${ipAddress}`).digest('hex');
}

export function extractClientIp(headers: Headers) {
  const forwardedFor = headers.get('x-forwarded-for');

  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() ?? null;
  }

  return headers.get('x-real-ip');
}

export async function listApprovedMessages(limit = 20): Promise<GuestbookRow[]> {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    throw new Error('Guestbook service is not configured.');
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('id, nickname, message, created_at, approved_at')
    .eq('status', 'approved')
    .eq('is_hidden', false)
    .order('approved_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return data satisfies GuestbookRow[];
}

export async function enforceRateLimit(ipHash: string | null) {
  if (!ipHash) {
    return;
  }

  const supabase = getSupabaseAdmin();

  if (!supabase) {
    throw new Error('Guestbook service is not configured.');
  }

  const windowStart = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { count, error } = await supabase
    .from(TABLE_NAME)
    .select('id', { head: true, count: 'exact' })
    .eq('ip_hash', ipHash)
    .gte('created_at', windowStart);

  if (error) {
    throw new Error(error.message);
  }

  if ((count ?? 0) >= 3) {
    throw new Error('提交过于频繁，请稍后再试。');
  }
}

export async function createPendingMessage(input: MessageInput) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    throw new Error('Guestbook service is not configured.');
  }

  const { error } = await supabase.from(TABLE_NAME).insert({
    nickname: input.nickname,
    message: input.message,
    status: 'pending',
    ip_hash: input.ipHash,
    user_agent: input.userAgent,
  });

  if (error) {
    throw new Error(error.message);
  }
}
