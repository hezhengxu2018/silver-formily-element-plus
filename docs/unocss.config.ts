import { defineConfig, presetAttributify, presetIcons, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [presetWind4(), presetAttributify(), presetIcons()],
  content: {
    pipeline: {
      include: [`./**/*`],
      exclude: [`./node_modules/**/*`, `./.vitepress/cache/**/*`],
    },
  },
  theme: {
    breakpoints: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
    colors: {
      primary: {
        DEFAULT: '#2563eb',
        deep: '#1d4ed8',
      },
    },
  },
})
