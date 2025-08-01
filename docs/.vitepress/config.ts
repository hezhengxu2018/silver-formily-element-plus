import { defineConfig } from 'vitepress'
// import { head } from './config/head'
// import { mdPlugin } from './config/markdown-plugin'
// import { nav } from './config/nav'
// import { sidebar } from './config/sidebar'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Formily Element Plus',
  description: 'Element Plus 的 Formily 封装',
  // head,
  themeConfig: {
    footer: {
      message: 'Released under the MIT License.',
    },
  },
  locales: {
    'zh-cn': {
      label: '简体中文',
      lang: 'zh-cn',
    },
  },
  // markdown: {
  //   config: md => mdPlugin(md),
  //   languages: [import('@shikijs/langs/tsx')],
  // },
})
