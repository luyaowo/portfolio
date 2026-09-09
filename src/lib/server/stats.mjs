import { createHash, timingSafeEqual } from 'node:crypto';

export const privateHeaders = {
  'Cache-Control': 'private, no-store',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
};

// Fail closed. A long, randomly generated password is required for this private endpoint.
export function protectStats(request, password = process.env.STATS_PASSWORD) {
  if (!password || password.length < 24) {
    return new Response('私人统计页尚未配置访问密码。', { status: 503, headers: privateHeaders });
  }
  const header = request.headers.get('authorization') || '';
  let supplied = '';
  if (header.startsWith('Basic ') && header.length < 4096) {
    supplied = Buffer.from(header.slice(6), 'base64').toString('utf8');
  }
  const hash = value => createHash('sha256').update(value).digest();
  if (!timingSafeEqual(hash(supplied), hash(`luyao:${password}`))) {
    return new Response('请登录后查看网站统计。', {
      status: 401,
      headers: { ...privateHeaders, 'WWW-Authenticate': 'Basic realm="Private statistics", charset="UTF-8"' },
    });
  }
  return null;
}

export function dateRange(days, now = new Date()) {
  if (![1, 7, 30].includes(days)) throw new Error('请选择今天、近 7 天或近 30 天。');
  const start = new Date(now);
  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() - days + 1);
  return { since: start.toISOString(), until: now.toISOString() };
}

export class StatsError extends Error {
  constructor(message, status = 502) { super(message); this.status = status; }
}

function metric(value) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    throw new StatsError('统计接口返回了无法识别的数据，请稍后重试。');
  }
  return value;
}

const cache = new Map();
export async function readStats(days, { env = process.env, fetcher = fetch, now = new Date(), useCache = true } = {}) {
  const range = dateRange(days, now);
  const token = env.STATS_VERCEL_TOKEN;
  const projectId = env.STATS_VERCEL_PROJECT_ID;
  const teamId = env.STATS_VERCEL_TEAM_ID;
  if (!token || !projectId) throw new StatsError('尚未连接 Vercel。请先完成服务器端统计配置。', 503);
  const key = `${projectId}:${teamId || ''}:${days}:${range.since}:${createHash('sha256').update(token).digest('hex')}`;
  const cached = cache.get(key);
  if (useCache && cached && now.getTime() - cached.at < 300_000) return cached.data;

  async function query(by) {
    const url = new URL('https://api.vercel.com/v1/query/web-analytics/visits/aggregate');
    for (const [key, value] of Object.entries({ projectId, ...range, by, limit: '50', filter: "environment eq 'production'" })) url.searchParams.set(key, value);
    if (teamId) url.searchParams.set('teamId', teamId);
    let response;
    try {
      response = await fetcher(url, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(15_000), cache: 'no-store', redirect: 'error' });
    } catch { throw new StatsError('暂时无法连接 Vercel，请稍后重试。'); }
    if (!response.ok) {
      const messages = {
        400: 'Vercel 无法查询这个时间范围，请尝试近 7 天。',
        401: 'Vercel 授权已失效，请更新统计密钥。',
        402: '当前套餐无法读取这些统计数据，请在 Vercel 后台核对权限。',
        403: '当前密钥没有统计读取权限，请在 Vercel 后台核对。',
        404: '未找到统计项目或接口，请核对配置及 Web Analytics 是否启用。',
        429: '查询次数较多，请稍后再试。',
      };
      throw new StatsError(messages[response.status] || 'Vercel 暂时未能返回统计数据，请稍后重试。');
    }
    let body;
    try { body = await response.json(); } catch { throw new StatsError('统计接口返回格式异常，请稍后重试。'); }
    if (!Array.isArray(body.data)) throw new StatsError('统计接口返回格式异常，请稍后重试。');
    return body.data.map(row => ({ ...row, pageviews: metric(row.pageviews), visitors: metric(row.visitors) }));
  }
  // Query the whole period independently: daily unique visitor counts must not be summed.
  const [summary, trend, pages, sources, devices] = await Promise.all([
    query('environment'), query('day'), query('requestPath'), query('referrerHostname'), query('deviceType'),
  ]);
  if (summary.length > 1 || (summary[0] && summary[0].environment !== 'production')) throw new StatsError('统计环境与预期不符，请核对接口。');
  const data = {
    days, ...range, updatedAt: now.toISOString(),
    summary: { pageviews: summary[0]?.pageviews ?? 0, visitors: summary[0]?.visitors ?? 0 },
    trend: trend.map(row => {
      if (typeof row.timestamp !== 'string' || !Number.isFinite(Date.parse(row.timestamp))) throw new StatsError('统计日期格式异常。');
      return { date: row.timestamp.slice(0, 10), pageviews: row.pageviews, visitors: row.visitors };
    }).sort((a, b) => a.date.localeCompare(b.date)),
    pages: pages.map(row => ({ label: String(row.requestPath ?? ''), count: row.pageviews })),
    sources: sources.map(row => ({ label: String(row.referrerHostname || '直接访问 / 来源未知'), count: row.pageviews })),
    devices: devices.map(row => ({ label: String(row.deviceType || '未知设备'), count: row.pageviews })),
  };
  if (useCache) { if (cache.size >= 12) cache.clear(); cache.set(key, { at: now.getTime(), data }); }
  return data;
}
