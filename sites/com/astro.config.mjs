import { defineConfig } from 'astro/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: 'https://monsieurclick.com',
  output: 'static',
  build: { format: 'directory' },
  vite: {
    resolve: {
      alias: {
        '@mc/shared': path.resolve(root, '../../packages/shared'),
      },
    },
  },
});
