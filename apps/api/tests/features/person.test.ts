import { env } from 'cloudflare:test';
import { beforeAll, describe } from 'vitest';
import { queryCreatePersonTable } from './utils';

describe('person test', () => {
  beforeAll(async () => {
    await env.DB.prepare(queryCreatePersonTable).run();
    await env.DB.prepare(queryCreatePersonTable).run();
    // nanya dulu best practice passing object antar test gimana
  });
});
