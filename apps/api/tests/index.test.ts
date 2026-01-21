import app from '@/index';
import { env } from 'cloudflare:test';
import { testClient } from 'hono/testing';
import { describe, expect, it } from 'vitest';

describe('Test unit test', () => {
  const client = testClient(app, env);

  it('should run ok', async () => {
    const res = await client.index.$get();
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toBe('Hello');
  });
});
