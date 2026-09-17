import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  return {
    plugins: [react()],
    server: {
      port: 3000,
    },
    resolve: {
      alias: {
        app: resolve(__dirname, "src", "app"),
        components: resolve(__dirname, "src", "components"),
        hooks: resolve(__dirname, "src", "hooks"),
        services: resolve(__dirname, "src", "services"),
        types: resolve(__dirname, "src", "types"),
        utils: resolve(__dirname, "src", "utils"),
        constants: resolve(__dirname, "src", "constants"),
      },
    },
  };
});
