import { defineWorkersProject } from '@cloudflare/vitest-pool-workers/config';
import path from 'path';

export default defineWorkersProject(() => {
  return {
    test: {
      globals: true,
      watch: false,
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
      poolOptions: {
        workers: {
          wrangler: { configPath: './wrangler.jsonc' },
          miniflare: {
            d1Databases: ['DB'],
          },
        },
      },
    },
  };
});
