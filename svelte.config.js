import preprocess from 'svelte-preprocess';

const config = {
  preprocess: preprocess({
    scss: {
      prependData: '@import "src/scss//old/base/_variables.scss";'
    },
    typescript: {
      tsconfigFile: './tsconfig.json'
    }
  })
};

export default config;
