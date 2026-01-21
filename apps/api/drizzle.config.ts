import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema',
  out: './drizzle/migration',
  dialect: 'sqlite',
  dbCredentials: {
    url: '.wrangler/state/v3/d1/miniflare-D1DatabaseObject/a86f68350a2049cfb9ccc403a4d90a90ce260fbee30ba8a76dc6e8322c15ea1e.sqlite',
  },
});
