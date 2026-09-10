//import react from "@vitejs/plugin-react";
//import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { reactRouter } from "@react-router/dev/vite";
//import babel from "@rolldown/plugin-babel";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // react(),
    reactRouter(),
    tailwindcss(),
    //  babel({ presets: [reactCompilerPreset()]}),
  ],
  resolve: {
    tsconfigPaths: true,
  },

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000/v0.1",
        changeOrigin: true,
      },
    },
  },
});
