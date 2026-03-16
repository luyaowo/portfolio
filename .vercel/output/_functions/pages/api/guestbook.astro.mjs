import { createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
export { renderers } from '../../renderers.mjs';

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": "https://luyao.studio", "SSR": true};
const TABLE_NAME = "guestbook_messages";
function getEnv() {
  return Object.assign(__vite_import_meta_env__, { _: process.env._ });
}
function getSupabaseAdmin() {
  const env = getEnv();
  const url = env.SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    return null;
  }
  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
function isGuestbookConfigured() {
  return Boolean(getSupabaseAdmin());
}
function normalizeNickname(value) {
  return value.replace(/\s+/g, " ").trim();
}
function normalizeMessage(value) {
  return value.replace(/\r\n/g, "\n").trim();
}
function validateGuestbookInput(nickname, message) {
  if (nickname.length < 1 || nickname.length > 24) {
    throw new Error("昵称长度需要在 1 到 24 个字符之间。");
  }
  if (message.length < 1 || message.length > 500) {
    throw new Error("留言长度需要在 1 到 500 个字符之间。");
  }
}
function hashIpAddress(ipAddress) {
  if (!ipAddress) {
    return null;
  }
  const env = getEnv();
  const salt = env.GUESTBOOK_IP_HASH_SALT ?? "guestbook-default-salt";
  return createHash("sha256").update(`${salt}:${ipAddress}`).digest("hex");
}
function extractClientIp(headers) {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? null;
  }
  return headers.get("x-real-ip");
}
async function listApprovedMessages(limit = 20) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error("Guestbook service is not configured.");
  }
  const { data, error } = await supabase.from(TABLE_NAME).select("id, nickname, message, created_at, approved_at").eq("status", "approved").eq("is_hidden", false).order("approved_at", { ascending: false, nullsFirst: false }).order("created_at", { ascending: false }).limit(limit);
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
async function enforceRateLimit(ipHash) {
  if (!ipHash) {
    return;
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error("Guestbook service is not configured.");
  }
  const windowStart = new Date(Date.now() - 10 * 60 * 1e3).toISOString();
  const { count, error } = await supabase.from(TABLE_NAME).select("id", { head: true, count: "exact" }).eq("ip_hash", ipHash).gte("created_at", windowStart);
  if (error) {
    throw new Error(error.message);
  }
  if ((count ?? 0) >= 3) {
    throw new Error("提交过于频繁，请稍后再试。");
  }
}
async function createPendingMessage(input) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error("Guestbook service is not configured.");
  }
  const { error } = await supabase.from(TABLE_NAME).insert({
    nickname: input.nickname,
    message: input.message,
    status: "pending",
    ip_hash: input.ipHash,
    user_agent: input.userAgent
  });
  if (error) {
    throw new Error(error.message);
  }
}

const prerender = false;
function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}
const GET = async () => {
  if (!isGuestbookConfigured()) {
    return json(
      {
        ok: false,
        message: "留言系统尚未完成配置。",
        messages: []
      },
      503
    );
  }
  try {
    const messages = await listApprovedMessages();
    return json({ ok: true, messages });
  } catch (error) {
    const message = error instanceof Error ? error.message : "读取留言失败。";
    return json({ ok: false, message, messages: [] }, 500);
  }
};
const POST = async ({ request }) => {
  if (!isGuestbookConfigured()) {
    return json({ ok: false, message: "留言系统尚未完成配置。" }, 503);
  }
  try {
    const contentType = request.headers.get("content-type") ?? "";
    let nickname = "";
    let message = "";
    let website = "";
    if (contentType.includes("application/json")) {
      const body = await request.json();
      nickname = String(body.nickname ?? "");
      message = String(body.message ?? "");
      website = String(body.website ?? "");
    } else {
      const formData = await request.formData();
      nickname = String(formData.get("nickname") ?? "");
      message = String(formData.get("message") ?? "");
      website = String(formData.get("website") ?? "");
    }
    if (website.trim()) {
      return json({ ok: true, message: "已收到，审核后会展示在这里。" }, 202);
    }
    const normalizedNickname = normalizeNickname(nickname);
    const normalizedMessage = normalizeMessage(message);
    validateGuestbookInput(normalizedNickname, normalizedMessage);
    const ipHash = hashIpAddress(extractClientIp(request.headers));
    await enforceRateLimit(ipHash);
    await createPendingMessage({
      nickname: normalizedNickname,
      message: normalizedMessage,
      ipHash,
      userAgent: request.headers.get("user-agent")
    });
    return json({ ok: true, message: "已收到，审核后会展示在这里。" }, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "提交失败，请稍后再试。";
    const status = message.includes("频繁") ? 429 : 400;
    return json({ ok: false, message }, status);
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
