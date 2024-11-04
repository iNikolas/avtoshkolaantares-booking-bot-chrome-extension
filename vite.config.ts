import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

import path from "path";

export default defineConfig(({ mode }) => {
  const isScriptsMode = mode === "scripts";

  const input: Record<string, string> = isScriptsMode
    ? {
        "content-script": path.resolve(
          __dirname,
          "src/scripts/content-script.ts",
        ),
      }
    : {
        main: path.resolve(__dirname, "index.html"),
      };

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": "/src",
        "@components": "/src/components",
        "@screens": "/src/screens",
        "@utils": "/src/utils",
        "@assets": "/src/assets",
        "@entities": "/src/entities",
        "@config": "/src/config",
      },
    },
    build: {
      emptyOutDir: !isScriptsMode,
      rollupOptions: {
        input,
        output: {
          entryFileNames: "[name].js",
          manualChunks: isScriptsMode ? () => null : undefined,
        },
      },
    },
  };
});
