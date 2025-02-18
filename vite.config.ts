import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import path from "path";
import { globSync } from "glob";
const ASSERT_BASE = "/assets/dist/";
export default ({ mode }: { mode: string }) => {
  return defineConfig({
    plugins: [],
    build: {
      manifest: mode === "development" ? false : true,

      outDir: "templates" + ASSERT_BASE,
      emptyOutDir: true,
      rollupOptions: {
        input: Object.fromEntries(
          globSync(["src/main.ts"]).map((file) => [
            path.relative("src", file.slice(0, file.length - path.extname(file).length)),
            fileURLToPath(new URL(file, import.meta.url)),
          ])
        ),
        output: {
          format: "es",
          entryFileNames: "[name].min.js",
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith(".css")) {
              return "css/[name].min.[ext]";
            }
            return "[name].min.[ext]";
          },
        },
      },
      sourcemap: false,
      chunkSizeWarningLimit: 1024,
    },
  });
};
