import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import { globSync } from "glob";
import { loadEnv } from "vite";
const ASSERT_BASE = "/assets/dist/";
export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd());
  return defineConfig({
    plugins: [
      {
        name: "write-version-plugin",
        closeBundle() {
          const version = env.VITE_THEME_VERSION;
          const yamlFilePath = path.resolve(__dirname, "theme.yaml");
          let yamlContent = fs.readFileSync(yamlFilePath, "utf8");
          yamlContent = yamlContent.replace(/version:\s*.*$/m, `version: ${version}`);
          fs.writeFileSync(yamlFilePath, yamlContent, "utf8");
        },
      },
    ],
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
          entryFileNames: `[name]-${env.VITE_THEME_VERSION}.min.js`,
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith(".css")) {
              return `css/[name]-${env.VITE_THEME_VERSION}.min.[ext]`;
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
