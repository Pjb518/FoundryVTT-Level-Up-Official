import { sveltePreprocess } from "svelte-preprocess";

const config = {
  compilerOptions: {
    compatibility: {
      componentApi: 4,
    },
  },
  preprocess: sveltePreprocess({
    scss: {
      prependData:
        '@use "src/scss/base/_variables.scss";  @use "src/scss/base/_functions.scss";',
    },
    typescript: {
      tsconfigFile: "./tsconfig.json",
    },
  }),
};

export default config;
