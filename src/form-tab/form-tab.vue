<script setup lang="ts">
import type { IFormTabProps } from './types.ts'
import { observable, reaction } from '@formily/reactive'
import { RecursionField, useField } from '@formily/vue'
import { ElBadge, ElTabPane, ElTabs } from 'element-plus'
import { computed, ref, watch } from 'vue'
import { stylePrefix } from '../__builtins__'
import { useTabs } from './hooks'
import { createFormTab } from './utils'

defineOptions({
  name: 'FFormTab',
})

const props = defineProps<IFormTabProps>()
const emit = defineEmits(['input'])

const field = useField()
const prefixCls = `${stylePrefix}-form-tab`
const formTabRef = computed(() => props.formTab ?? createFormTab())
const tabs = useTabs()
const _activeKey = ref(props?.value ?? formTabRef.value.activeKey ?? tabs?.[0]?.name)

reaction(() => {
  return tabs.length
}, () => {
  !tabs.some(tab => tab.name === _activeKey.value) && (_activeKey.value = tabs?.[0]?.name)
}, {
  fireImmediately: true,
})
watch(() => formTabRef.value.activeKey, (val) => {
  _activeKey.value = val
})

const errorList = observable.computed(() => {
  return tabs.map((tab) => {
    return field.value.form.queryFeedbacks({
      type: 'error',
      address: `${field.value.address}.${tab.name}.*`,
    }).length
  })
})

function handleTabChange(key: string) {
  /* istanbul ignore if -- @preserve */
  if (typeof key !== 'string')
    return
  emit('input', key)
  formTabRef.value.setActiveKey?.(key)
}
</script>

<template>
  <ElTabs
    :model-value="_activeKey"
    style="width: 100%;"
    @tab-change="handleTabChange"
  >
    <ElTabPane
      v-for="({ props: tabProps, schema, name }, key) in tabs"
      :key="name"
      v-bind="tabProps"
    >
      <template #default>
        <RecursionField :schema="schema" :name="name" />
      </template>
      <template #label>
        <ElBadge
          v-if="errorList.value[key] !== 0"
          :class="prefixCls"
          :value="errorList.value[key]"
        >
          {{ tabProps.label }}
        </ElBadge>
        <template v-else>
          {{ tabProps.label }}
        </template>
      </template>
    </ElTabPane>
  </ElTabs>
</template>
