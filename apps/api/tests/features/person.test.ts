import { env } from 'cloudflare:test';
import { beforeAll, describe, expect, it } from 'vitest';
import {
  generateToken,
  queryCreatePersonTable,
  queryCreateUserTable,
  querySeedUserTable,
} from './utils';
import { testClient } from 'hono/testing';
import app from '@/index';

describe('person test', () => {
  beforeAll(async () => {
    await env.DB.prepare(queryCreatePersonTable).run();
    await env.DB.prepare(queryCreateUserTable).run();
    await env.DB.prepare(querySeedUserTable).run();
  });

  const client = testClient(app, env);

  it('should success add new person', async () => {
    const token = await generateToken();

    const res = await client.person.$post(
      {
        json: {
          name: 'test',
          fullname: 'test test test',
          address: 'jl test',
          gender: 'male',
          birthDate: new Date(2001, 1, 8).toISOString(),
        },
      },
      {
        headers: {
          Authorization: `BEARER ${token}`,
        },
      },
    );

    const jsonResponse = await res.json();
    console.log(jsonResponse);
    expect(jsonResponse.code).toBe(201);
    expect(jsonResponse.success).toBe(true);
    if (jsonResponse.success) {
      expect(jsonResponse.data?.id).toBeDefined();
    }
  });
});
