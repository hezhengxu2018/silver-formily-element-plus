<script setup lang="ts">
import type { Form } from '@formily/core'
import type { IQueryFormLightProps } from './types'
import { reaction, toJS } from '@formily/reactive'
import { createSchemaField, useFieldSchema, useForm } from '@silver-formily/vue'
import { throttle } from 'lodash-es'
import { computed, onUnmounted, useSlots } from 'vue'
import { stylePrefix, useCleanAttrs } from '../__builtins__'
import { Form as FForm } from '../form'
import { mergeQueryFormComponents } from './default-components'

defineOptions({
  name: 'FQueryFormLight',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<IQueryFormLightProps>(), {
  components: () => ({}),
  throttleWait: 300,
})
const emit = defineEmits<{
  (e: 'autoSubmit', values: Form['values']): void
  (e: 'autoSubmitFailed', error: any): void
}>()

const { props: formProps } = useCleanAttrs(['modelValue', 'onUpdate:modelValue'])
const slots = useSlots()
const formRef = useForm()
const fieldSchemaRef = useFieldSchema()
const prefixCls = `${stylePrefix}-query-form-light`

const activeForm = computed<Form | undefined>(() => formProps.value.form ?? formRef?.value)
const resolvedSchema = computed(() => props.schema ?? fieldSchemaRef.value)

const innerFormProps = computed(() => ({
  fullness: false,
  ...formProps.value,
}))

function submitByChange() {
  const form = activeForm.value
  form
    .submit((values) => {
      emit('autoSubmit', values)
      return formProps.value.onAutoSubmit?.(values)
    })
    .catch((error) => {
      emit('autoSubmitFailed', error)
      formProps.value.onAutoSubmitFailed?.(error)
    })
}

const triggerSubmit = throttle(() => {
  submitByChange()
}, props.throttleWait, {
  leading: false,
  trailing: true,
})

const dispose = reaction(() => {
  const form = activeForm.value
  if (!form)
    return
  return toJS(form.values)
}, () => {
  triggerSubmit()
})

onUnmounted(() => {
  dispose()
  triggerSubmit.cancel()
})

const hasDefaultSlot = Boolean(slots.default)
const mergedComponents = mergeQueryFormComponents(props.components)
const schemaField = computed(() => {
  if (hasDefaultSlot || !resolvedSchema.value)
    return null
  return props.schemaField ?? createSchemaField({ components: mergedComponents }).SchemaField
})
</script>

<template>
  <FForm v-bind="innerFormProps" :class="prefixCls">
    <div :class="`${prefixCls}__content`">
      <slot v-if="hasDefaultSlot" />
      <component
        :is="schemaField"
        v-else-if="schemaField"
        :schema="resolvedSchema"
      />
    </div>
  </FForm>
</template>
