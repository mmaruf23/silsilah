import { env } from 'cloudflare:test';
import { beforeAll, describe, expect, it } from 'vitest';
import {
  queryCreatePersonTable,
  queryCreateUserTable,
  querySeedUserTable,
} from './utils';
import { testClient } from 'hono/testing';
import app from '@/index';

describe('login test', () => {
  beforeAll(async () => {
    await env.DB.prepare(queryCreatePersonTable).run();
    await env.DB.prepare(queryCreateUserTable).run();
    await env.DB.prepare(querySeedUserTable).run();
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

  it('should login success', async () => {
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
      expect(resJson.data?.token).toBeDefined();
    }
  });
});
