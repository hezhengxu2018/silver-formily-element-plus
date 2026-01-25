import ElementPlus, { ID_INJECTION_KEY, ZINDEX_INJECTION_KEY } from 'element-plus'
import {
  VitepressEpDemoBox,
  VitepressEpDemoPlaceholder,
} from 'vitepress-better-demo-plugin/theme/element-plus'
import Theme from 'vitepress-theme-element-plus'
import 'virtual:group-icons.css'
import '../styles/theme.css'

export default {
  ...Theme,
  enhanceApp({ app }) {
    app.use(ElementPlus)
    app.provide(ID_INJECTION_KEY, { prefix: 0, current: 0 })
    app.provide(ZINDEX_INJECTION_KEY, { current: 0 })
    app.component('VitepressDemoBox', VitepressEpDemoBox)
    app.component('VitepressDemoPlaceholder', VitepressEpDemoPlaceholder)
  },
}
