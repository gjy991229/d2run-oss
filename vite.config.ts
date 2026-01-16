import { defineConfig, Plugin } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import fs from "fs";

const host = process.env.TAURI_DEV_HOST;

/**
 * Vite plugin to handle optional cloud/impl module
 * Returns empty module if the impl directory is missing (open-source build)
 */
function optionalCloudImpl(): Plugin {
  // Cache the check result
  let implExists: boolean | null = null;

  function checkImplExists(): boolean {
    if (implExists === null) {
      const implDir = path.resolve(__dirname, 'src/cloud/impl');
      implExists = fs.existsSync(implDir) && fs.readdirSync(implDir).filter(f => f.endsWith('.ts')).length > 0;
    }
    return implExists;
  }

  return {
    name: 'optional-cloud-impl',
    resolveId(source, importer) {
      // Check if this is a cloud impl import (multiple patterns)
      const isCloudImplImport =
        source.includes('cloud/impl/') ||  // Absolute path
        (source.startsWith('./impl/') && importer?.includes('cloud')) ||  // Relative from cloud/
        (source.startsWith('../cloud/impl/'));  // Relative from composables/

      if (isCloudImplImport && !checkImplExists()) {
        return { id: 'virtual:empty-cloud-impl', moduleSideEffects: false };
      }
      return null;
    },
    load(id) {
      if (id === 'virtual:empty-cloud-impl') {
        // Return empty exports - the catch block in the importing code will handle this
        return 'export default {}';
      }
      return null;
    }
  };
}

// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [vue(), optionalCloudImpl()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
        protocol: "ws",
        host,
        port: 1421,
      }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },

  // Build optimization
  build: {
    target: "esnext",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info", "console.debug"],
      },
      mangle: true,
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ["vue"],
          pinia: ["pinia"],
          // Separate large data files into their own chunks for better caching
          gamedata: ["./src/shared/data"],
          dashboard: ["./src/shared/dashboardTemplate"]
        },
      },
    },
    reportCompressedSize: true,
    chunkSizeWarningLimit: 500,
  },
}));

