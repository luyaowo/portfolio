import type { APIRoute } from 'astro';
import { privateHeaders, protectStats, readStats, StatsError } from '../../lib/server/stats.mjs';
export const prerender = false;

export const GET: APIRoute = async ({ request, url }) => {
  const denied = protectStats(request);
  if (denied) return denied;
  const days = Number(url.searchParams.get('days') || 7);
  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
    status, headers: { ...privateHeaders, 'Content-Type': 'application/json; charset=utf-8' },
  });
  if (![1, 7, 30].includes(days)) return json({ message: '请选择有效的时间范围。' }, 400);
  try { return json(await readStats(days)); }
  catch (error) {
    return json({ message: error instanceof StatsError ? error.message : '统计暂时不可用，请稍后重试。' }, error instanceof StatsError ? error.status : 502);
  }
};
