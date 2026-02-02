/// <reference types="vitest" />
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import glob from 'fast-glob'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import { pkg } from './build/constants'

function resolve(dir) {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  return path.resolve(__dirname, dir)
}

// 获取导出入口
export function getComponentEntries() {
  return Object.fromEntries(
    glob
      .sync('src/**/*.{ts,tsx}', {
        ignore: ['src/**/*.test.{ts,tsx}', 'src/**/__tests__/**'],
      })
      .map(file => [
        path.relative('src', file.slice(0, file.length - path.extname(file).length)),
        resolve(file),
      ]),
  )
}

export default defineConfig({
  build: {
    lib: {
      entry: getComponentEntries(),
      formats: ['es'],
      fileName: (format, fileName) => {
        const extension = format === 'cjs' ? 'js' : 'mjs'
        return `${fileName}.${extension}`
      },
    },
    outDir: './esm',
    emptyOutDir: true,
    cssCodeSplit: true,
    sourcemap: true,
    rollupOptions: {
      external: Object.keys(pkg.peerDependencies).concat(Object.keys(pkg.dependencies)),
      output: {
        assetFileNames: (assetInfo) => {
          const originalFileName = assetInfo.originalFileNames[0]
          const originalDirName = originalFileName?.match(/src\/(.*)\/index.ts/)?.[1]
          return originalDirName ? `styles/${originalDirName}/[name][extname]` : `styles/[name][extname]`
        },
        chunkFileNames(chunkInfo) {
          if (chunkInfo.name.includes('vue_vue')) {
            const fileName = chunkInfo.name.split('.')[0]
            const regex = /.*src\/(.+)\/[^/]+\.vue\?.*/
            const outDir = chunkInfo.moduleIds.at(-1)?.match(regex)?.[1]
            return `${outDir}${path.sep}${fileName}.mjs`
          }
          return `vendor${path.sep}${chunkInfo.name}.mjs`
        },
        manualChunks: {
          lodash: ['lodash-es'],
        },
      },
      treeshake: {
        moduleSideEffects: (id) => {
          if (id.includes('@formily/shared')) {
            return false
          }
          return true
        },
      },
    },
  },
  plugins: [
    libInjectCss(),
    dts({
      outDir: ['./esm'],
      exclude: ['./**/style.ts', './**/*.test.{ts,tsx}'],
      cleanVueFileName: true,
    }),
    vue(),
    vueJsx(),
  ],
})
