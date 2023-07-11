// vite.config.js
import { svelte } from "file:///B:/FVTT/FoundryVTTNode/Data/systems/FoundryVTT-Level-Up-Official/node_modules/@sveltejs/vite-plugin-svelte/src/index.js";
import preprocess from "file:///B:/FVTT/FoundryVTTNode/Data/systems/FoundryVTT-Level-Up-Official/node_modules/svelte-preprocess/dist/index.js";
import path from "path";
var __vite_injected_original_dirname = "B:\\FVTT\\FoundryVTTNode\\Data\\systems\\FoundryVTT-Level-Up-Official";
var config = {
  root: "src/",
  base: "/systems/a5e/",
  publicDir: path.resolve(__vite_injected_original_dirname, "public"),
  server: {
    port: 30001,
    open: true,
    proxy: {
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
      preprocess: preprocess(),
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJCOlxcXFxGVlRUXFxcXEZvdW5kcnlWVFROb2RlXFxcXERhdGFcXFxcc3lzdGVtc1xcXFxGb3VuZHJ5VlRULUxldmVsLVVwLU9mZmljaWFsXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJCOlxcXFxGVlRUXFxcXEZvdW5kcnlWVFROb2RlXFxcXERhdGFcXFxcc3lzdGVtc1xcXFxGb3VuZHJ5VlRULUxldmVsLVVwLU9mZmljaWFsXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9COi9GVlRUL0ZvdW5kcnlWVFROb2RlL0RhdGEvc3lzdGVtcy9Gb3VuZHJ5VlRULUxldmVsLVVwLU9mZmljaWFsL3ZpdGUuY29uZmlnLmpzXCI7Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnJlc29sdmVkXG5pbXBvcnQgeyBzdmVsdGUgfSBmcm9tICdAc3ZlbHRlanMvdml0ZS1wbHVnaW4tc3ZlbHRlJztcbmltcG9ydCBwcmVwcm9jZXNzIGZyb20gJ3N2ZWx0ZS1wcmVwcm9jZXNzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5jb25zdCBjb25maWcgPSB7XG4gIHJvb3Q6ICdzcmMvJyxcbiAgYmFzZTogJy9zeXN0ZW1zL2E1ZS8nLFxuICBwdWJsaWNEaXI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdwdWJsaWMnKSxcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogMzAwMDEsXG4gICAgb3BlbjogdHJ1ZSxcbiAgICBwcm94eToge1xuICAgICAgJ14oPyEvc3lzdGVtcy9hNWUpJzogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMDAnLFxuICAgICAgJy9zb2NrZXQuaW8nOiB7XG4gICAgICAgIHRhcmdldDogJ3dzOi8vbG9jYWxob3N0OjMwMDAwJyxcbiAgICAgICAgd3M6IHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnZGlzdCcpLFxuICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxuICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgICBicm90bGlTaXplOiB0cnVlLFxuICAgIGxpYjoge1xuICAgICAgbmFtZTogJ0xldmVsIFVwOiBBZHZhbmNlZCA1ZScsXG4gICAgICBlbnRyeTogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9pbmRleC5qcycpLFxuICAgICAgZm9ybWF0czogWydlcyddLFxuICAgICAgZmlsZU5hbWU6ICgpID0+ICdpbmRleC5qcydcbiAgICB9XG4gIH0sXG4gIGVzYnVpbGQ6IHtcbiAgICBrZWVwTmFtZXM6IHRydWVcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHN2ZWx0ZSh7XG4gICAgICBwcmVwcm9jZXNzOiBwcmVwcm9jZXNzKCksXG4gICAgICBvbndhcm46ICh3YXJuaW5nLCBoYW5kbGVyKSA9PiB7XG4gICAgICAgIC8vIFN1cHByZXNzIGBhMTF5LW1pc3NpbmctYXR0cmlidXRlYCBmb3IgbWlzc2luZyBocmVmIGluIDxhPiBsaW5rcy5cbiAgICAgICAgLy8gRm91bmRyeSBkb2Vzbid0IGZvbGxvdyBhY2Nlc3NpYmlsaXR5IHJ1bGVzLlxuICAgICAgICBpZiAod2FybmluZy5tZXNzYWdlLmluY2x1ZGVzKCc8YT4gZWxlbWVudCBzaG91bGQgaGF2ZSBhbiBocmVmIGF0dHJpYnV0ZScpKSByZXR1cm47XG4gICAgICAgIGlmICh3YXJuaW5nLmNvZGUgPT09ICdhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMnKSByZXR1cm47XG5cbiAgICAgICAgY29uc29sZS5sb2cod2FybmluZyk7XG5cbiAgICAgICAgLy8gTGV0IFJvbGx1cCBoYW5kbGUgYWxsIG90aGVyIHdhcm5pbmdzIG5vcm1hbGx5LlxuICAgICAgICBoYW5kbGVyKHdhcm5pbmcpO1xuICAgICAgfVxuICAgIH0pXG4gIF1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbmZpZztcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxTQUFTLGNBQWM7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxVQUFVO0FBSGpCLElBQU0sbUNBQW1DO0FBS3pDLElBQU0sU0FBUztBQUFBLEVBQ2IsTUFBTTtBQUFBLEVBQ04sTUFBTTtBQUFBLEVBQ04sV0FBVyxLQUFLLFFBQVEsa0NBQVcsUUFBUTtBQUFBLEVBQzNDLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLHFCQUFxQjtBQUFBLE1BQ3JCLGNBQWM7QUFBQSxRQUNaLFFBQVE7QUFBQSxRQUNSLElBQUk7QUFBQSxNQUNOO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVEsS0FBSyxRQUFRLGtDQUFXLE1BQU07QUFBQSxJQUN0QyxhQUFhO0FBQUEsSUFDYixXQUFXO0FBQUEsSUFDWCxZQUFZO0FBQUEsSUFDWixLQUFLO0FBQUEsTUFDSCxNQUFNO0FBQUEsTUFDTixPQUFPLEtBQUssUUFBUSxrQ0FBVyxjQUFjO0FBQUEsTUFDN0MsU0FBUyxDQUFDLElBQUk7QUFBQSxNQUNkLFVBQVUsTUFBTTtBQUFBLElBQ2xCO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsV0FBVztBQUFBLEVBQ2I7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLFlBQVksV0FBVztBQUFBLE1BQ3ZCLFFBQVEsQ0FBQyxTQUFTLFlBQVk7QUFHNUIsWUFBSSxRQUFRLFFBQVEsU0FBUywyQ0FBMkM7QUFBRztBQUMzRSxZQUFJLFFBQVEsU0FBUztBQUFxQztBQUUxRCxnQkFBUSxJQUFJLE9BQU87QUFHbkIsZ0JBQVEsT0FBTztBQUFBLE1BQ2pCO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUNGO0FBRUEsSUFBTyxzQkFBUTsiLAogICJuYW1lcyI6IFtdCn0K
