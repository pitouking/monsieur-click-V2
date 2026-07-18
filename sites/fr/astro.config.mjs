import { defineConfig } from 'astro/config';

/** monsieurclick.fr — contenu natif FR */
export default defineConfig({
  site: 'https://monsieurclick.fr',
  output: 'static',
  build: {
    format: 'directory',
  },
  vite: {
    server: { watch: { ignored: ['**/dist/**'] } },
  },
});
