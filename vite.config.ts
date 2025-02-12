// eslint-disable-next-line import/no-unresolved
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { sveltePreprocess } from 'svelte-preprocess';
import path from 'path';

const config = {
  root: 'src/',
  base: '/systems/a5e/',
  publicDir: path.resolve(__dirname, 'public'),
  server: {
    port: 30001,
    open: true,
    proxy: {
      '^(/systems/a5e/(assets|style.css))': 'http://localhost:30000',
      '^(?!/systems/a5e)': 'http://localhost:30000',
      '/socket.io': {
        target: 'ws://localhost:30000',
        ws: true
      }
    }
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    sourcemap: true,
    brotliSize: true,
    lib: {
      name: 'Level Up: Advanced 5e',
      entry: path.resolve(__dirname, 'src/a5e.ts'),
      formats: ['es'],
      fileName: 'a5e'
    }
  },
  esbuild: {
    keepNames: true
  },
  plugins: [
    svelte({
      preprocess: sveltePreprocess({
        scss: {
          prependData: `@use "src/scss/base/_variables.scss";
                        @use "src/scss/base/_functions.scss";
                        `
        },
        typescript: {
          tsconfigFile: './tsconfig.json'
        }
      }),
      onwarn: (warning, handler) => {
        // Suppress `a11y-missing-attribute` for missing href in <a> links.
        // Foundry doesn't follow accessibility rules.
        if (warning.message.includes('<a> element should have an href attribute')) return;
        if (warning.code === 'a11y-click-events-have-key-events') return;

        // eslint-disable-next-line no-console
        console.log(warning);

        // Let Rollup handle all other warnings normally.
        handler?.(warning);
      }
    })
  ]
};

export default config;
