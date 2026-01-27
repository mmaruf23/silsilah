import { env } from 'cloudflare:test';
import { beforeAll, describe, expect, it } from 'vitest';
import {
  generateToken,
  queryCreateDescendantTable,
  queryCreateMariageTable,
  queryCreatePersonTable,
  queryCreateUserTable,
  querySeedMariageTable,
  querySeedPersonTable,
  querySeedUserTable,
} from './utils';
import { testClient } from 'hono/testing';
import app from '@/index';

describe('mariage test', () => {
  beforeAll(async () => {
    await env.DB.prepare(queryCreatePersonTable).run();
    await env.DB.prepare(queryCreateUserTable).run();
    await env.DB.prepare(queryCreateMariageTable).run();
    await env.DB.prepare(queryCreateDescendantTable).run();
    await env.DB.prepare(querySeedPersonTable).run();
    await env.DB.prepare(querySeedUserTable).run();
    await env.DB.prepare(querySeedMariageTable).run();
  });

  const client = testClient(app, env);

  it('should success add new mariage', async () => {
    const token = await generateToken(env.JWT_SECRET, true);
    const res = await client.mariage.$post(
      {
        json: { husband_id: 1, wife_id: 3 },
      },
      {
        headers: {
          authorization: `BEARER ${token}`,
        },
      },
    );

    const jsonResponse = await res.json();
    expect(jsonResponse.success).toBe(true);
    expect(jsonResponse.code).toBe(201);
    if (jsonResponse.success) {
      expect(jsonResponse.data).toBeDefined();
      expect(jsonResponse.data?.id).toBeDefined();
    }
  });

  it('should fail bad request add new mariage', async () => {
    const token = await generateToken(env.JWT_SECRET, true);
    const res = await client.mariage.$post(
      {
        json: {},
      },
      {
        headers: {
          authorization: `BEARER ${token}`,
        },
      },
    );

    const jsonResponse = await res.json();
    expect(jsonResponse.success).toBe(false);
    expect(jsonResponse.code).toBe(400);
    if (!jsonResponse.success) {
      expect(jsonResponse.message).toBeDefined();
      expect(jsonResponse.errors).toBeDefined();
    }
  });
  it('should fail not found add new mariage', async () => {
    const token = await generateToken(env.JWT_SECRET, true);
    const res = await client.mariage.$post(
      {
        json: { husband_id: 100 },
      },
      {
        headers: {
          authorization: `BEARER ${token}`,
        },
      },
    );

    const jsonResponse = await res.json();
    expect(jsonResponse.success).toBe(false);
    expect(jsonResponse.code).toBe(404);
    if (!jsonResponse.success) {
      expect(jsonResponse.message).toBeDefined();
    }
  });

  it('should fail conflict add new mariage', async () => {
    const token = await generateToken(env.JWT_SECRET, true);
    const res = await client.mariage.$post(
      {
        json: { husband_id: 1, wife_id: 2 },
      },
      {
        headers: {
          authorization: `BEARER ${token}`,
        },
      },
    );

    const jsonResponse = await res.json();
    expect(jsonResponse.success).toBe(false);
    expect(jsonResponse.code).toBe(400);
    if (!jsonResponse.success) {
      expect(jsonResponse.message).toBeDefined();
    }
  });
});
