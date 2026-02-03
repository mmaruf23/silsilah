import { env } from 'cloudflare:test';
import { beforeAll, describe, expect, it } from 'vitest';
import { testClient } from 'hono/testing';
import app from '@/index';
import { migrations } from '../migrations.generated';

describe('auth test', () => {
  beforeAll(async () => {
    const prepareds = Object.values(migrations).map((m) => env.DB.prepare(m));
    await env.DB.batch(prepareds);
  });

  const client = testClient(app, env);

  it('should success register', async () => {
    const res = await client.auth.register.$post({
      json: {
        username: 'testusername',
        password: 'testpassword',
      },
    });

    expect(res.status).toBe(200);
    const resJson = await res.json();
    expect(resJson.code).toBe(200);
    expect(resJson.success).toBeTruthy();
    if (resJson.success) {
      expect(resJson.data).toBeDefined();
      expect(resJson.data?.id).toBeDefined();
    }
  });

  it('should suceess login', async () => {
    const res = await client.auth.login.$post({
      json: {
        username: 'rifasella',
        password: null,
      },
    });

    expect(res.status).toBe(200);
    const resJson = await res.json();
    expect(resJson.code).toBe(200);
    expect(resJson.success).toBe(true);
    if (resJson.success) {
      expect(resJson.data).toBeDefined();
    }
  });
});
