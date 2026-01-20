import { observer } from '@formily/reactive-vue'
import { connect, mapProps } from '@silver-formily/vue'
import { mapReadPretty } from '../__builtins__'
import { PreviewText } from '../preview-text'
import FCascader from './cascader.vue'

export const Cascader = connect(
  observer(FCascader),
  mapProps({ dataSource: 'options', value: 'modelValue', disabled: true }),
  mapReadPretty(PreviewText.Cascader),
)

export default Cascader
