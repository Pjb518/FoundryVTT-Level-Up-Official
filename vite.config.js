const path = require('path');

const config = {
  root: 'src/',
  base: '/systems/lu-a5e/',
  publicDir: path.resolve(__dirname, 'public'),
  server: {
    port: 30001,
    open: true,
    proxy: {
      '^(?!/systems/lu-a5e)': 'http://localhost:30000',
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
    lib: {
      name: 'Level Up: Advanced 5e',
      entry: path.resolve(__dirname, 'src/index.js'),
      formats: ['es'],
      fileName: () => 'index.js'
    }
  }
};

export default config;
