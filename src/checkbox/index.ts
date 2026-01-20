import { connect, mapProps } from '@silver-formily/vue'
import { ElCheckbox } from 'element-plus'
import { composeExport, mapReadPretty } from '../__builtins__'
import { PreviewText } from '../preview-text'
import FCheckboxGroup from './checkbox-group.vue'

const CheckboxGroup = connect(
  FCheckboxGroup,
  mapProps({ dataSource: 'options', disabled: true }),
  mapReadPretty(PreviewText.Select, {
    multiple: true,
  }),
)

const InnerCheckbox = connect(
  ElCheckbox,
  mapProps({
    value: 'modelValue',
    disabled: true,
  }),
)

export const Checkbox = composeExport(InnerCheckbox, {
  Group: CheckboxGroup,
})

export default Checkbox
