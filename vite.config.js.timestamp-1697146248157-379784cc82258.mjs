// vite.config.js
import { svelte } from "file:///Users/philbest/Projects/a5e/node_modules/@sveltejs/vite-plugin-svelte/src/index.js";
import preprocess from "file:///Users/philbest/Projects/a5e/node_modules/svelte-preprocess/dist/index.js";
import path from "path";
var __vite_injected_original_dirname = "/Users/philbest/Projects/a5e";
var config = {
  root: "src/",
  base: "/systems/a5e/",
  publicDir: path.resolve(__vite_injected_original_dirname, "public"),
  server: {
    port: 30001,
    open: true,
    proxy: {
      "^(/systems/a5e/(assets|style.css))": "http://localhost:30000",
      "^(?!/systems/a5e)": "http://localhost:30000",
      "/socket.io": {
        target: "ws://localhost:30000",
        ws: true
      }
    }
  },
  build: {
    outDir: path.resolve(__vite_injected_original_dirname, "dist"),
    emptyOutDir: true,
    sourcemap: true,
    brotliSize: true,
    lib: {
      name: "Level Up: Advanced 5e",
      entry: path.resolve(__vite_injected_original_dirname, "src/index.js"),
      formats: ["es"],
      fileName: () => "index.js"
    }
  },
  esbuild: {
    keepNames: true
  },
  plugins: [
    svelte({
      preprocess: preprocess({
        scss: {
          prependData: '@import "src/scss//old/base/_variables.scss";'
        }
      }),
      onwarn: (warning, handler) => {
        if (warning.message.includes("<a> element should have an href attribute"))
          return;
        if (warning.code === "a11y-click-events-have-key-events")
          return;
        console.log(warning);
        handler(warning);
      }
    })
  ]
};
var vite_config_default = config;
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvcGhpbGJlc3QvUHJvamVjdHMvYTVlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvcGhpbGJlc3QvUHJvamVjdHMvYTVlL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9waGlsYmVzdC9Qcm9qZWN0cy9hNWUvdml0ZS5jb25maWcuanNcIjsvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVucmVzb2x2ZWRcbmltcG9ydCB7IHN2ZWx0ZSB9IGZyb20gJ0BzdmVsdGVqcy92aXRlLXBsdWdpbi1zdmVsdGUnO1xuaW1wb3J0IHByZXByb2Nlc3MgZnJvbSAnc3ZlbHRlLXByZXByb2Nlc3MnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmNvbnN0IGNvbmZpZyA9IHtcbiAgcm9vdDogJ3NyYy8nLFxuICBiYXNlOiAnL3N5c3RlbXMvYTVlLycsXG4gIHB1YmxpY0RpcjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3B1YmxpYycpLFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiAzMDAwMSxcbiAgICBvcGVuOiB0cnVlLFxuICAgIHByb3h5OiB7XG4gICAgICAnXigvc3lzdGVtcy9hNWUvKGFzc2V0c3xzdHlsZS5jc3MpKSc6ICdodHRwOi8vbG9jYWxob3N0OjMwMDAwJyxcbiAgICAgICdeKD8hL3N5c3RlbXMvYTVlKSc6ICdodHRwOi8vbG9jYWxob3N0OjMwMDAwJyxcbiAgICAgICcvc29ja2V0LmlvJzoge1xuICAgICAgICB0YXJnZXQ6ICd3czovL2xvY2FsaG9zdDozMDAwMCcsXG4gICAgICAgIHdzOiB0cnVlXG4gICAgICB9XG4gICAgfVxuICB9LFxuICBidWlsZDoge1xuICAgIG91dERpcjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2Rpc3QnKSxcbiAgICBlbXB0eU91dERpcjogdHJ1ZSxcbiAgICBzb3VyY2VtYXA6IHRydWUsXG4gICAgYnJvdGxpU2l6ZTogdHJ1ZSxcbiAgICBsaWI6IHtcbiAgICAgIG5hbWU6ICdMZXZlbCBVcDogQWR2YW5jZWQgNWUnLFxuICAgICAgZW50cnk6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvaW5kZXguanMnKSxcbiAgICAgIGZvcm1hdHM6IFsnZXMnXSxcbiAgICAgIGZpbGVOYW1lOiAoKSA9PiAnaW5kZXguanMnXG4gICAgfVxuICB9LFxuICBlc2J1aWxkOiB7XG4gICAga2VlcE5hbWVzOiB0cnVlXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICBzdmVsdGUoe1xuICAgICAgcHJlcHJvY2VzczogcHJlcHJvY2Vzcyh7XG4gICAgICAgIHNjc3M6IHtcbiAgICAgICAgICBwcmVwZW5kRGF0YTogJ0BpbXBvcnQgXCJzcmMvc2Nzcy8vb2xkL2Jhc2UvX3ZhcmlhYmxlcy5zY3NzXCI7J1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIG9ud2FybjogKHdhcm5pbmcsIGhhbmRsZXIpID0+IHtcbiAgICAgICAgLy8gU3VwcHJlc3MgYGExMXktbWlzc2luZy1hdHRyaWJ1dGVgIGZvciBtaXNzaW5nIGhyZWYgaW4gPGE+IGxpbmtzLlxuICAgICAgICAvLyBGb3VuZHJ5IGRvZXNuJ3QgZm9sbG93IGFjY2Vzc2liaWxpdHkgcnVsZXMuXG4gICAgICAgIGlmICh3YXJuaW5nLm1lc3NhZ2UuaW5jbHVkZXMoJzxhPiBlbGVtZW50IHNob3VsZCBoYXZlIGFuIGhyZWYgYXR0cmlidXRlJykpIHJldHVybjtcbiAgICAgICAgaWYgKHdhcm5pbmcuY29kZSA9PT0gJ2ExMXktY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50cycpIHJldHVybjtcblxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICBjb25zb2xlLmxvZyh3YXJuaW5nKTtcblxuICAgICAgICAvLyBMZXQgUm9sbHVwIGhhbmRsZSBhbGwgb3RoZXIgd2FybmluZ3Mgbm9ybWFsbHkuXG4gICAgICAgIGhhbmRsZXIod2FybmluZyk7XG4gICAgICB9XG4gICAgfSlcbiAgXVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY29uZmlnO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLFNBQVMsY0FBYztBQUN2QixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLFVBQVU7QUFIakIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTSxTQUFTO0FBQUEsRUFDYixNQUFNO0FBQUEsRUFDTixNQUFNO0FBQUEsRUFDTixXQUFXLEtBQUssUUFBUSxrQ0FBVyxRQUFRO0FBQUEsRUFDM0MsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsc0NBQXNDO0FBQUEsTUFDdEMscUJBQXFCO0FBQUEsTUFDckIsY0FBYztBQUFBLFFBQ1osUUFBUTtBQUFBLFFBQ1IsSUFBSTtBQUFBLE1BQ047QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUSxLQUFLLFFBQVEsa0NBQVcsTUFBTTtBQUFBLElBQ3RDLGFBQWE7QUFBQSxJQUNiLFdBQVc7QUFBQSxJQUNYLFlBQVk7QUFBQSxJQUNaLEtBQUs7QUFBQSxNQUNILE1BQU07QUFBQSxNQUNOLE9BQU8sS0FBSyxRQUFRLGtDQUFXLGNBQWM7QUFBQSxNQUM3QyxTQUFTLENBQUMsSUFBSTtBQUFBLE1BQ2QsVUFBVSxNQUFNO0FBQUEsSUFDbEI7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxXQUFXO0FBQUEsRUFDYjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsWUFBWSxXQUFXO0FBQUEsUUFDckIsTUFBTTtBQUFBLFVBQ0osYUFBYTtBQUFBLFFBQ2Y7QUFBQSxNQUNGLENBQUM7QUFBQSxNQUNELFFBQVEsQ0FBQyxTQUFTLFlBQVk7QUFHNUIsWUFBSSxRQUFRLFFBQVEsU0FBUywyQ0FBMkM7QUFBRztBQUMzRSxZQUFJLFFBQVEsU0FBUztBQUFxQztBQUcxRCxnQkFBUSxJQUFJLE9BQU87QUFHbkIsZ0JBQVEsT0FBTztBQUFBLE1BQ2pCO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUNGO0FBRUEsSUFBTyxzQkFBUTsiLAogICJuYW1lcyI6IFtdCn0K
