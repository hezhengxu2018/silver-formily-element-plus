import { connect, mapProps } from '@silver-formily/vue'
import { ElInputNumber } from 'element-plus'
import { mapReadPretty, transformComponent } from '../__builtins__'
import { PreviewText } from '../preview-text'

export type InputNumberProps = typeof ElInputNumber

const TransformElInputNumber = transformComponent<InputNumberProps>(
  ElInputNumber,
  {
    change: 'update:modelValue',
  },
)

export const InputNumber = connect(
  TransformElInputNumber,
  mapProps(
    {
      value: 'modelValue',
      readOnly: 'readonly',
    },
    (props) => {
      return {
        controlsPosition: props.controlsPosition ?? 'right',
        modelValue: props.modelValue,
      }
    },
  ),
  mapReadPretty(PreviewText.Input),
)

export default InputNumber
