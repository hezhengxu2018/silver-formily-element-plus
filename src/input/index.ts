import { connect, mapProps } from '@silver-formily/vue'
import { composeExport, mapReadPretty } from '../__builtins__'
import { PreviewText } from '../preview-text'
import FInput from './input.vue'

const InnerInput = connect(
  FInput,
  mapProps({
    value: 'modelValue',
    readOnly: 'readonly',
  }),
  mapReadPretty(PreviewText.Input),
)

const TextArea = connect(
  FInput,
  mapProps((props) => {
    return {
      ...props,
      modelValue: props.value,
      readonly: props.readOnly,
      type: 'textarea',
    }
  }),
  mapReadPretty(PreviewText.Input),
)

export const Input = composeExport(InnerInput, {
  TextArea,
})

export default Input
