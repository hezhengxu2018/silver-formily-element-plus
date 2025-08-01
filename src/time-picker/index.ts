import { connect, mapProps } from '@formily/vue'
import { ElTimePicker } from 'element-plus'
import { mapReadPretty, transformComponent } from '../__builtins__'
import { PreviewText } from '../preview-text'

export type TimePickerProps = typeof ElTimePicker

const TransformElTimePicker = transformComponent<TimePickerProps>(
  ElTimePicker,
  {
    change: 'update:modelValue',
  },
)

export const TimePicker = connect(
  TransformElTimePicker,
  mapProps({ readOnly: 'readonly', value: 'modelValue' }),
  mapReadPretty(PreviewText.TimePicker),
)

export default TimePicker
