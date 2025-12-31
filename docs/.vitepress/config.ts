import type { EPThemeConfig } from 'vitepress-theme-element-plus'
import path from 'node:path'
import vueJsx from '@vitejs/plugin-vue-jsx'
import mdContainer from 'markdown-it-container'
import VueMacros from 'unplugin-vue-macros/vite'
import { defineConfig } from 'vitepress'
import { createDemoContainer } from 'vitepress-better-demo-plugin'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import { mdExternalLinkIcon, mdTableWrapper, mdTag, mdTooltip } from 'vitepress-theme-element-plus/node'
import zhComponent from './i18n/zh/pages/component.json'
import zhNav from './i18n/zh/pages/nav.json'

export default defineConfig<EPThemeConfig>({
  title: 'Formily Element Plus',
  description: 'Element Plus 的 Formily 封装',
  // head,
  themeConfig: {
    footer: {
      message: 'Released under the MIT License.',
    },
    logo: '/formily-logo.svg',
  },
  locales: {
    zh: {
      label: '简体中文',
      lang: 'zh',
      themeConfig: {
        footer: {
          message: '本项目基于 MIT 协议开源',
        },
        sidebar: {
          '/guide/': [
            {
              text: 'Guide',
              items: [
                { text: 'Index', link: '/guide/' },
                { text: 'One', link: '/guide/one' },
                { text: 'Two', link: '/guide/two' },
              ],
            },
          ],
          '/zh/component/': zhComponent,
        },
        nav: zhNav,
        socialLinks: [
          { icon: 'github', link: 'https://github.com/hezhengxu2018/silver-formily-element-plus' },
        ],
      },
    },
  },
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin)
      md.use(mdExternalLinkIcon)
      md.use(mdTag)
      md.use(mdTooltip)
      md.use(mdTableWrapper)
      md.use(mdContainer, 'demo', createDemoContainer(md, {
        demoDir: path.resolve(import.meta.dirname, '../zh/demos'),
        autoImportWrapper: false,
      }))
    },
  },
  vite: {
    resolve: {
      alias: [
        {
          find: '@silver-formily/element-plus',
          replacement: `${path.resolve(import.meta.dirname, '../../src')}/`,
        },
        {
          find: /^dayjs$/,
          replacement: 'dayjs/esm/index.js',
        },
        {
          find: /^dayjs\/plugin\/(.+?)(?:\.js)?$/,
          replacement: 'dayjs/esm/plugin/$1/index.js',
        },
      ],
    },
    plugins: [groupIconVitePlugin(), VueMacros({
      setupComponent: false,
      setupSFC: false,
      plugins: {
        vueJsx: vueJsx(),
      },
    })],
    ssr: { noExternal: [
      'vitepress-theme-element-plus',
      'vitepress-better-demo-plugin',
    ] },
    optimizeDeps: {
      include: ['dayjs'],
      exclude: ['vitepress-theme-element-plus'],
    },
  },
})
