import type { APIRoute } from 'astro';
import {
  createPendingMessage,
  enforceRateLimit,
  extractClientIp,
  hashIpAddress,
  isGuestbookConfigured,
  listApprovedMessages,
  normalizeMessage,
  normalizeNickname,
  validateGuestbookInput,
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
    return json(
      {
        ok: false,
        message: '留言系统尚未完成配置。',
        messages: [],
      },
      503
    );
  }

  try {
    const messages = await listApprovedMessages();
    return json({ ok: true, messages });
  } catch (error) {
    const message = error instanceof Error ? error.message : '读取留言失败。';
    return json({ ok: false, message, messages: [] }, 500);
  }
};

export const POST: APIRoute = async ({ request }) => {
  if (!isGuestbookConfigured()) {
    return json({ ok: false, message: '留言系统尚未完成配置。' }, 503);
  }

  try {
    const contentType = request.headers.get('content-type') ?? '';
    let nickname = '';
    let message = '';
    let website = '';

    if (contentType.includes('application/json')) {
      const body = await request.json();
      nickname = String(body.nickname ?? '');
      message = String(body.message ?? '');
      website = String(body.website ?? '');
    } else {
      const formData = await request.formData();
      nickname = String(formData.get('nickname') ?? '');
      message = String(formData.get('message') ?? '');
      website = String(formData.get('website') ?? '');
    }

    if (website.trim()) {
      return json({ ok: true, message: '已收到，审核后会展示在这里。' }, 202);
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
      userAgent: request.headers.get('user-agent'),
    });

    return json({ ok: true, message: '已收到，审核后会展示在这里。' }, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : '提交失败，请稍后再试。';
    const status = message.includes('频繁') ? 429 : 400;
    return json({ ok: false, message }, status);
  }
};
