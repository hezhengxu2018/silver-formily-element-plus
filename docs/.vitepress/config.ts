import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import VueMacros from 'unplugin-vue-macros/vite'
import { defineConfig } from 'vitepress'
import { vitepressDemoPlugin } from 'vitepress-demo-plugin'
import zhComponent from './i18n/zh/pages/component.json'
import zhNav from './i18n/zh/pages/nav.json'

export default defineConfig({
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
      md.use(vitepressDemoPlugin, {
        demoDir: path.resolve(import.meta.dirname, '../zh/demos'),
      })
    },
  },
  vite: {
    resolve: {
      alias: [{
        find: /^.*\/VPNav\.vue$/,
        replacement: fileURLToPath(
          new URL('theme/components/VPNav.vue', import.meta.url),
        ),
      }, {
        find: '@silver-formily/element-plus',
        replacement: `${path.resolve(import.meta.dirname, '../../src')}/`,
      }],
    },
    plugins: [
      VueMacros({
        setupComponent: false,
        setupSFC: false,
        plugins: {
          vueJsx: vueJsx(),
        },
      }),
      Components({
        dirs: ['.vitepress/vitepress/components'],
        allowOverrides: true,
        resolvers: [
          IconsResolver(),
        ],
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      }),
      Icons({
        autoInstall: true,
      }),
      UnoCSS({
        configFile: '../uno.config.ts',
      }),
    ],
  },
})
