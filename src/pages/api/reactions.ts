import type { APIRoute } from 'astro';
import {
  extractClientIp,
  hashIpAddress,
  isGuestbookConfigured,
  listPageReactions,
  togglePageReaction,
} from '../../lib/server/guestbook';

export const prerender = false;

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

export const GET: APIRoute = async () => {
  if (!isGuestbookConfigured()) {
    return json({ ok: false, message: '留言系统尚未完成配置。', reactions: {} }, 503);
  }

  try {
    const reactions = await listPageReactions();
    return json({ ok: true, reactions });
  } catch (error) {
    console.error('[reactions] 读取表情计数失败:', error);
    return json({ ok: false, message: '留言服务暂时不可用，请稍后再来。', reactions: {} }, 500);
  }
};

export const POST: APIRoute = async ({ request }) => {
  if (!isGuestbookConfigured()) {
    return json({ ok: false, message: '留言系统尚未完成配置。' }, 503);
  }

  let emoji = '';

  try {
    const body = await request.json();
    emoji = String(body.emoji ?? '');
  } catch {
    return json({ ok: false, message: '请求格式不正确。' }, 400);
  }

  const ip = extractClientIp(request.headers);
  const ipHash = hashIpAddress(ip);

  try {
    await togglePageReaction(emoji, ipHash);
    const reactions = await listPageReactions();
    return json({ ok: true, reactions });
  } catch (error) {
    if (error instanceof Error && (error.message.includes('不支持') || error.message.includes('访问者'))) {
      return json({ ok: false, message: error.message }, 400);
    }

    console.error('[reactions] 表情操作失败:', error);
    return json({ ok: false, message: '留言服务暂时不可用，请稍后再来。' }, 500);
  }
};
