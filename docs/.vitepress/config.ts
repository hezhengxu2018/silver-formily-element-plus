import type { EPThemeConfig } from 'vitepress-theme-element-plus'
import path from 'node:path'
import vueJsx from '@vitejs/plugin-vue-jsx'
import mdContainer from 'markdown-it-container'
import VueMacros from 'unplugin-vue-macros/vite'
import { defineConfig } from 'vitepress'
import { createDemoContainer } from 'vitepress-better-demo-plugin'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import { mdExternalLinkIcon, mdTableWrapper, mdTag, mdTooltip } from 'vitepress-theme-element-plus/node'
import pkg from '../../package.json' with { type: 'json' }
import zhComponent from './i18n/zh/pages/component.json'
import zhNav from './i18n/zh/pages/nav.json'

const SITE_URL = 'https://silver-formily-element-plus.pages.dev'

export default defineConfig<EPThemeConfig>({
  title: 'Silver Formily Element Plus',
  description: 'Element Plus 的 Formily 封装',
  head: [
    ['meta', { name: 'description', content: 'Element Plus 的 Formily 封装组件库和使用指南' }],
    ['meta', { name: 'keywords', content: 'Formily, Element Plus, 表单, 组件库, Vue' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Silver Formily Element Plus' }],
    ['meta', { property: 'og:title', content: 'Silver Formily Element Plus' }],
    ['meta', { property: 'og:description', content: 'Formily + Element Plus 组件库文档、示例与最佳实践' }],
    ['meta', { property: 'og:url', content: SITE_URL }],
    ['link', { rel: 'canonical', href: SITE_URL }],
  ],
  sitemap: {
    hostname: SITE_URL,
  },
  themeConfig: {
    version: pkg.version,
    search: {
      provider: 'local',
    },
    footer: {
      message: 'Released under the MIT License.',
    },
    logo: '/formily-logo.svg',
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        footer: {
          message: 'Released under the MIT License.',
        },
      },
    },
    zh: {
      label: '简体中文',
      lang: 'zh',
      link: '/zh/',
      themeConfig: {
        footer: {
          message: '本项目基于 MIT 协议开源',
        },
        sidebar: {
          '/zh/guide/': [
            {
              text: 'Guide',
              items: [
                { text: '介绍', link: '/zh/guide/introduction' },
                { text: '重大改动', link: '/zh/guide/breaking-changes' },
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
      include: ['@formily/core', '@silver-formily/vue', '@formily/reactive-vue', '@formily/reactive', '@formily/shared', 'lodash-es', '@element-plus/icons-vue', 'vue-draggable-plus', '@formily/grid', 'element-plus', 'dayjs'],
      exclude: ['vitepress-theme-element-plus'],
    },
  },
})
