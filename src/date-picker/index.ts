import type { DatePickerProps } from 'element-plus'
import { connect, mapProps } from '@silver-formily/vue'
import { ElDatePicker } from 'element-plus'
import { mapReadPretty } from '../__builtins__'
import { PreviewText } from '../preview-text'

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
  ElDatePicker,
  mapProps(
    {
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
