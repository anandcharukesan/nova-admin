import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig(() => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
    build: {
      outDir: path.resolve(__dirname, "nova_admin/static/nova_admin"),
      emptyOutDir: false,
      rollupOptions: {
        input: {
          style_bundle: path.resolve(__dirname, "src/index.css"),
        },
        output: {
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith(".css")) {
              return "css/theme.css";
            }
            return "assets/[name]-[hash][extname]";
          },
          entryFileNames: "js/[name].js",
          chunkFileNames: "js/[name]-[hash].js",
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== "true",
      watch: process.env.DISABLE_HMR === "true" ? null : {},
    },
  };
});
