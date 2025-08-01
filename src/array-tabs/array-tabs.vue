<script lang="ts" setup>
import type { ArrayField } from '@formily/core'
import type { TabPaneName } from 'element-plus'
import { observable } from '@formily/reactive'
import { isFn } from '@formily/shared'
import { RecursionField, useField, useFieldSchema } from '@formily/vue'
import { ElBadge, ElTabPane, ElTabs } from 'element-plus'
import { ref } from 'vue'
import { useCleanAttrs } from '../__builtins__'
import { stylePrefix } from '../__builtins__/configs'
import { getArrayItemSchema } from '../array-base/utils'

defineOptions({
  name: 'FArrayTabs',
  inheritAttrs: false,
})

const fieldRef = useField<ArrayField>()
const schemaRef = useFieldSchema()

const prefixCls = `${stylePrefix}-array-tabs`
const activeKey = ref<TabPaneName>('tab-0')

const field = fieldRef.value
/* istanbul ignore else -- @preserve */
if (field.value.length === 0) {
  field.value.push(null)
}
const schema = schemaRef.value
function getTabTitle(index: number) {
  return `${field.title || 'Untitled'} ${index + 1}`
}

const errorList = observable.computed(() => {
  return field.value.map((item, index) => {
    const path = field.address.concat(index)
    return field.form.queryFeedbacks({
      type: 'error',
      address: `${path}.**`,
    })
  })
})

const { props: elTabProps } = useCleanAttrs(['value'])
</script>

<template>
  <ElTabs
    v-bind="elTabProps"
    :model-value="activeKey"
    :class="prefixCls"
    type="card"
    :addable="true"
    @tab-remove="(target) => {
      const index = target.toString().match(/tab-(\d+)/)?.[1]
      field.remove(Number(index))
      if (activeKey === target) {
        activeKey = `tab-${Number(index) - 1}`
      }

      if (isFn($attrs['tab-remove'])) {
        $attrs['tab-remove'](target)
      }
    }"
    @tab-add="() => {
      const id = field.value.length
      field.value.push(null)
      activeKey = `tab-${id}`
      if (isFn($attrs['tab-add'])) {
        $attrs['tab-add']()
      }
    }"
    @change="() => {}"
  >
    <ElTabPane
      v-for="(item, index) of field.value"
      :key="`tab-${index}`"
      :closable="index !== 0"
      :name="`tab-${index}`"
    >
      <template #default>
        <RecursionField
          :schema="getArrayItemSchema(schema, index)"
          :name="index"
        />
      </template>
      <template #label>
        <span v-if="errorList.value[index]?.length > 0">
          <ElBadge
            :class="[`${prefixCls}-errors-badge`]"
            :value="errorList.value[index].length"
          >
            {{ getTabTitle(index) }}
          </ElBadge>
        </span>
        <span v-else>
          {{ getTabTitle(index) }}
        </span>
      </template>
    </ElTabPane>
  </ElTabs>
</template>
