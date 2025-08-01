import type { TimeSelectProps } from 'element-plus'
import { connect, mapProps } from '@formily/vue'
import { ElTimeSelect } from 'element-plus'
import { mapReadPretty, transformComponent } from '../__builtins__'
import { PreviewText } from '../preview-text'

const TransformElTimeSelect = transformComponent<TimeSelectProps>(
  ElTimeSelect,
  {
    change: 'update:modelValue',
  },
)

export const TimeSelect = connect(
  TransformElTimeSelect,
  mapProps({ value: 'modelValue', disabled: 'disabled', editable: 'editable' }),
  mapReadPretty(PreviewText.Input),
)

export default TimeSelect
