import app from '@/index';
import { env } from 'cloudflare:test';
import { testClient } from 'hono/testing';
import { beforeAll, describe, expect, it } from 'vitest';
import { queryCreatePersonTable, queryCreateUserTable } from './utils';
import type { SuccessResponse } from '@/types/response.type';

describe('register test', () => {
  // bikin tabel dulu
  beforeAll(async () => {
    await env.DB.prepare(queryCreatePersonTable).run();
    await env.DB.prepare(queryCreateUserTable).run();
  });
  const client = testClient(app, env);

  it('register success', async () => {
    const res = await client.auth.register.$post({
      json: {
        username: 'testusername',
        password: 'testpassword',
      },
    });

    expect(res.status).toBe(200);
    const resJson = (await res.json()) as SuccessResponse<{ id: number }>;
    expect(resJson.success).toBeTruthy();
    expect(resJson.data).toBeDefined();
    expect(resJson.data?.id).toBeDefined();
  });
});
