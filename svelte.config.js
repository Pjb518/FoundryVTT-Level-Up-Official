import preprocess from 'svelte-preprocess';

const config = {
  preprocess: preprocess({
    scss: {
      prependData: '@import "src/scss//base/_variables.scss";'
    }
  })
};

export default config;
