import ElementPlus, { ID_INJECTION_KEY, ZINDEX_INJECTION_KEY } from 'element-plus'
import {
  VitepressEpDemoBox,
  VitepressEpDemoPlaceholder,
} from 'vitepress-better-demo-plugin/theme/element-plus'
import vitepressNprogress from 'vitepress-plugin-nprogress'
import Theme from 'vitepress-theme-element-plus'
import 'virtual:group-icons.css'
import 'vitepress-plugin-nprogress/lib/css/index.css'
import '../styles/theme.css'

export default {
  ...Theme,
  enhanceApp(ctx) {
    vitepressNprogress(ctx)
    ctx.app.use(ElementPlus)
    ctx.app.provide(ID_INJECTION_KEY, { prefix: 0, current: 0 })
    ctx.app.provide(ZINDEX_INJECTION_KEY, { current: 0 })
    ctx.app.component('VitepressDemoBox', VitepressEpDemoBox)
    ctx.app.component('VitepressDemoPlaceholder', VitepressEpDemoPlaceholder)
  },
}
