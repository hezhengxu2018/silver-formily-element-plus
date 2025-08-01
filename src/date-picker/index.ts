import type { DatePickerProps } from 'element-plus'
import { connect, mapProps } from '@formily/vue'
import { ElDatePicker } from 'element-plus'
import { mapReadPretty, transformComponent } from '../__builtins__'
import { PreviewText } from '../preview-text'

const TransformElDatePicker = transformComponent<DatePickerProps>(
  ElDatePicker,
  {
    change: 'update:modelValue',
  },
)

function getDefaultFormat(type: DatePickerProps['type'] = 'date', formatType = 'format') {
  if (type === 'week' && formatType === 'format') {
    return '[Week] ww'
  }
  else {
    switch (type) {
      case 'year':
      case 'years':
      case 'yearrange': {
        return 'YYYY'
      }
      case 'month':
      case 'months':
      case 'monthrange': {
        return 'YYYY-MM'
      }
      case 'week': {
        return 'ww'
      }
      case 'date':
      case 'dates':
      case 'daterange': {
        return 'YYYY-MM-DD'
      }
      case 'datetime':
      case 'datetimerange': {
        return 'YYYY-MM-DD HH:mm:ss'
      }
    }
  }
}

export const DatePicker = connect(
  TransformElDatePicker,
  mapProps(
    {
      value: 'modelValue',
      readOnly: 'readonly',
      disabled: true,
      editable: true,
    },
    (props: any) => {
      return {
        ...props,
        format: props.format || getDefaultFormat(props.type),
        valueFormat:
          props.valueFormat || getDefaultFormat(props.type, 'valueFormat'),
      }
    },
  ),
  mapReadPretty(PreviewText.DatePicker),
)

export default DatePicker
