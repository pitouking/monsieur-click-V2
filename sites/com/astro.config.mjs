import { defineConfig } from 'astro/config';

/** monsieurclick.com — contenu natif EN */
export default defineConfig({
  site: 'https://monsieurclick.com',
  output: 'static',
  build: {
    format: 'directory',
  },
  vite: {
    server: { watch: { ignored: ['**/dist/**'] } },
  },
});
