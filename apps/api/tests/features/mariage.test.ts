import { env } from 'cloudflare:test';
import { beforeAll, describe, expect, it } from 'vitest';
import { generateToken } from './utils';
import { testClient } from 'hono/testing';
import app from '@/index';
import { migrations } from '../migrations.generated';
import { drizzle } from 'drizzle-orm/d1';
import { persons } from '@/db/schema/person';

describe('mariage test', () => {
  beforeAll(async () => {
    const prepareds = Object.values(migrations).map((m) => env.DB.prepare(m));
    await env.DB.batch(prepareds);
  });

  const client = testClient(app, env);
  const db = drizzle(env.DB);

  it('should success add new mariage', async () => {
    const token = await generateToken(env.JWT_SECRET, true);
    const [husband, wife] = await db
      .insert(persons)
      .values([
        { name: 'husband', gender: 'male', address: 'st.test' },
        { name: 'wife', gender: 'female', address: 'st.test' },
      ])
      .returning();

    const res = await client.mariage.$post(
      {
        json: { husband_id: husband.id, wife_id: wife.id },
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
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
          authorization: `Bearer ${token}`,
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
          authorization: `Bearer ${token}`,
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
          authorization: `Bearer ${token}`,
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
