import { connect, mapProps } from '@formily/vue'
import { mapReadPretty } from '../__builtins__'
import { PreviewText } from '../preview-text'
import FSelect from './select.vue'

export const Select = connect(
  FSelect,
  mapProps({ dataSource: 'options', loading: true, disabled: true }),
  mapReadPretty(PreviewText.Select),
)

export default Select
