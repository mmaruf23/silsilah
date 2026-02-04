import { env } from 'cloudflare:test';
import { beforeAll, describe, expect, it } from 'vitest';
import { generateToken } from './utils';
import { testClient } from 'hono/testing';
import app from '@/index';
import { migrations } from '../migrations.generated';

describe('person test', () => {
  beforeAll(async () => {
    const prepareds = Object.values(migrations).map((m) => env.DB.prepare(m));
    await env.DB.batch(prepareds);
  });

  const client = testClient(app, env);

  it('should success add new person', async () => {
    const token = await generateToken(env.JWT_SECRET, true);
    const res = await client.person.$post(
      {
        json: {
          name: 'test',
          fullname: 'test test test',
          address: 'jl test',
          gender: 'male',
          birthDate: '2001-02-08',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const jsonResponse = await res.json();
    expect(jsonResponse.code).toBe(201);
    expect(jsonResponse.success).toBe(true);
    if (jsonResponse.success) {
      expect(jsonResponse.data?.id).toBeDefined();
    }
  });

  it('should success get all person', async () => {
    const res = await client.person.$get({
      query: {},
    });

    expect(res.status).toBe(200);
    const jsonResponse = await res.json();
    expect(jsonResponse.code).toBe(200);
    expect(jsonResponse.success).toBe(true);
    if (jsonResponse.success) {
      expect(jsonResponse.data).toBeDefined();
      expect(jsonResponse.data?.length).toBeGreaterThan(0);
    }
  });

  it('should success get person by id', async () => {
    const res = await client.person[':id'].$get(
      {
        param: {
          id: '1',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${await generateToken(env.JWT_SECRET)}`,
        },
      },
    );

    expect(res.status).toBe(200);
    const jsonResponse = await res.json();
    expect(jsonResponse.code).toBe(200);
    expect(jsonResponse.success).toBe(true);
    if (jsonResponse.success) {
      expect(jsonResponse.data).toBeDefined();
    }
  });

  it('should not found get person by id', async () => {
    const res = await client.person[':id'].$get(
      {
        param: {
          id: '9999',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${await generateToken(env.JWT_SECRET)}`,
        },
      },
    );

    expect(res.status).toBe(404);
    const jsonResponse = await res.json();
    expect(jsonResponse.code).toBe(404);
    expect(jsonResponse.success).toBe(false);
  });

  it('should unauthorize get person by id', async () => {
    const res = await client.person[':id'].$get(
      {
        param: {
          id: '1',
        },
      },
      {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJyaWZhc2VsbGEiLCJyb2xlIjoidXNlciIsImV4cCI6MTc2OTE2NDkzN30.wxnvEsDE3ikADuJKj7fHJ5iDYgEJg48g_Mbrat_jHrw`,
        },
      },
    );

    // expired token
    expect(res.status).toBe(401);
    const jsonResponse = await res.json();
    expect(jsonResponse.code).toBe(401);
    expect(jsonResponse.success).toBe(false);
  });

  it('should success update person', async () => {
    const token = await generateToken(env.JWT_SECRET, true);
    const res = await client.person[':id'].$put(
      {
        param: { id: '1' },
        json: {
          fullname: 'Yukinoshita Yukino',
          birthDate: '1995-01-03',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const jsonResponse = await res.json();
    expect(jsonResponse.code).toBe(200);
    expect(jsonResponse.success).toBe(true);
    if (jsonResponse.success) {
      expect(jsonResponse.data).toBeDefined();
      expect(jsonResponse.data?.fullname).toBe('Yukinoshita Yukino');
    }
  });

  it('should success update person even not an admin', async () => {
    const token = await generateToken(env.JWT_SECRET, false, 1);
    const res = await client.person[':id'].$put(
      {
        param: { id: '1' },
        json: {
          fullname: 'Yukinoshita Yukino',
          birthDate: '1995-01-03',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const jsonResponse = await res.json();
    expect(jsonResponse.code).toBe(200);
    expect(jsonResponse.success).toBe(true);
    if (jsonResponse.success) {
      expect(jsonResponse.data).toBeDefined();
      expect(jsonResponse.data?.fullname).toBe('Yukinoshita Yukino');
    }
  });

  it('should fail update person couse not user profile and not an admin', async () => {
    const token = await generateToken(env.JWT_SECRET, false, 2);
    const res = await client.person[':id'].$put(
      {
        param: { id: '1' },
        json: {
          fullname: 'Yukinoshita Yukino',
          birthDate: '1995-01-03',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const jsonResponse = await res.json();
    expect(jsonResponse.code).toBe(401);
    expect(jsonResponse.success).toBe(false);
  });

  it('should success delete person', async () => {
    const token = await generateToken(env.JWT_SECRET, true);
    const res = await client.person[':id'].$delete(
      {
        param: { id: '1' },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const jsonResponse = await res.json();
    expect(jsonResponse.success).toBe(true);
    expect(jsonResponse.code).toBe(200);
    if (jsonResponse.success) {
      expect(jsonResponse.data).toBe('SUCCESS DELETED');
    }
  });
});
