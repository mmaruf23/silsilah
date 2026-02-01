import app from '@/index';
import { env } from 'cloudflare:test';
import { testClient } from 'hono/testing';
import { beforeAll, describe, expect, it } from 'vitest';
import { migrations } from './migrations.generated';

describe('test unit test', () => {
  const client = testClient(app, env);
  beforeAll(async () => {
    const prepareds = Object.values(migrations).map((m) => env.DB.prepare(m));
    await env.DB.batch(prepareds);
  });

  it('should run ok', async () => {
    const p = await env.DB.prepare('SELECT * FROM persons').run();
    console.log(p);
    expect(true).toBe(true);
  });
});
