import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://juanpablosierra.com',
  compressHTML: true,
  build: {
    // Un solo archivo CSS: el sitio es una landing, evita cascadas de requests.
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      cssMinify: 'lightningcss',
    },
  },
});
