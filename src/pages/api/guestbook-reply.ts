import type { APIRoute } from 'astro';
import { readFile, writeFile, rename } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';

export const prerender = false;
const file = new URL('../../data/guestbook-replies.json', import.meta.url);
let queue = Promise.resolve();

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const url = new URL(request.url);
  const loopback = ['127.0.0.1', '::1', '::ffff:127.0.0.1'];
  // Only the local editor may write owner replies; this route is disabled in production.
  if (!import.meta.env.DEV || !loopback.includes(clientAddress) ||
      !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) ||
      request.headers.get('origin') !== url.origin) {
    return new Response(null, { status: 403 });
  }
  try {
    const input = await request.json();
    if (typeof input.messageId !== 'string' ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input.messageId) ||
        typeof input.text !== 'string' || !input.text.trim() || input.text.trim().length > 500) {
      return Response.json({ ok: false, message: '回复不能为空，最多 500 字。' }, { status: 400 });
    }
    const reply = { text: input.text.trim(), createdAt: new Date().toISOString() };
    const save = queue.then(async () => {
      const data = JSON.parse(await readFile(file, 'utf8'));
      data[input.messageId] = reply;
      const temporary = new URL(`guestbook-replies.${randomUUID()}.tmp`, file);
      await writeFile(temporary, JSON.stringify(data, null, 2) + '\n', { mode: 0o600 });
      await rename(temporary, file);
    });
    queue = save.catch(() => {});
    await save;
    return Response.json({ ok: true, reply });
  } catch {
    return Response.json({ ok: false, message: '保存失败，内容仍在输入框中，请重试。' }, { status: 500 });
  }
};
