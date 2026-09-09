import test from 'node:test';
import assert from 'node:assert/strict';
import { protectStats, dateRange, readStats } from '../src/lib/server/stats.mjs';
const password = 'test-only-password-with-32-characters';
const request = value => new Request('https://example.test/stats', { headers: value ? { authorization: `Basic ${Buffer.from(value).toString('base64')}` } : {} });
test('page and API guard fail closed, challenge invalid users, accept correct credentials', () => {
  assert.equal(protectStats(request(), '').status, 503);
  assert.equal(protectStats(request(), 'short').status, 503);
  assert.equal(protectStats(request(), password).status, 401);
  assert.equal(protectStats(request(`other:${password}`), password).status, 401);
  assert.equal(protectStats(request(`luyao:${password}`), password), null);
  assert.equal(protectStats(request(), password).headers.get('cache-control'), 'private, no-store');
});
test('UTC dates cross month boundaries and reject unbounded ranges', () => {
  assert.equal(dateRange(7, new Date('2026-09-02T03:00:00Z')).since, '2026-08-27T00:00:00.000Z');
  assert.throws(() => dateRange(365));
});
const env = { STATS_VERCEL_TOKEN: 'fixture-secret', STATS_VERCEL_PROJECT_ID: 'fixture-project', STATS_VERCEL_TEAM_ID: 'fixture-team' };
test('official queries preserve period UV, map dimensions and keep credentials server side', async () => {
  const calls = [];
  const fetcher = async (url, options) => {
    calls.push(url);
    assert.equal(url.origin, 'https://api.vercel.com');
    assert.equal(url.searchParams.get('filter'), "environment eq 'production'");
    assert.equal(options.headers.Authorization, 'Bearer fixture-secret');
    const by = url.searchParams.get('by');
    const row = { pageviews: 20, visitors: 5 };
    const data = by === 'environment' ? [{ ...row, environment: 'production' }] : by === 'day' ? [ { ...row, timestamp: '2026-09-01T00:00:00Z' }, { ...row, timestamp: '2026-09-02T00:00:00Z' } ] : [{ ...row, [by]: '/example' }];
    return Response.json({ data });
  };
  const result = await readStats(7, { env, fetcher, useCache: false });
  assert.equal(calls.length, 5);
  assert.equal(result.summary.visitors, 5);
  assert.equal(result.pages[0].count, 20);
  assert.ok(!JSON.stringify(result).includes('fixture-secret'));
});
test('missing setup, permission errors, malformed responses and timeout do not become zero traffic', async () => {
  await assert.rejects(readStats(7, { env: {}, useCache: false }), /尚未连接/);
  for (const status of [401, 402, 403, 429, 500]) {
    await assert.rejects(readStats(7, { env, useCache: false, fetcher: async () => new Response('', { status }) }));
  }
  await assert.rejects(readStats(7, { env, useCache: false, fetcher: async () => Response.json({ data: [{}] }) }), /无法识别/);
  await assert.rejects(readStats(7, { env, useCache: false, fetcher: async () => { throw new Error('timeout'); } }), /暂时无法连接/);
});
