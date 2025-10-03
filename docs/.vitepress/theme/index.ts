import type { Theme } from 'vitepress'
import ElementPlus from 'element-plus'
// https://vitepress.dev/guide/custom-theme
import Layout from './Layout.vue'
import './style.css'

export default {
  Layout,
  enhanceApp(ctx) {
    ctx.app.use(ElementPlus)
    // ...
  },
} satisfies Theme
