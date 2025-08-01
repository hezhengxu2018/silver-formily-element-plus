import { observer } from '@formily/reactive-vue'
import { composeExport } from '../__builtins__'
import FFormStepPane from './form-step-pane.vue'
import FFormStep from './form-step.vue'
import { createFormStep } from './utils'

const FormStepInner = observer(FFormStep)

export const FormStep = composeExport(FormStepInner, {
  StepPane: FFormStepPane,
  createFormStep,
})

export default FormStep
