<script setup lang="ts">
import type { IGridOptions } from '@formily/grid'
import type { IQueryFormProps } from './types'
import { Grid } from '@formily/grid'
import { autorun, markRaw } from '@formily/reactive'
import { createSchemaField } from '@silver-formily/vue'
import { ElLink } from 'element-plus'
import { computed, onUnmounted, ref, useAttrs, useSlots, watch } from 'vue'
import { hasSlotContent, stylePrefix } from '../__builtins__'
import { Form } from '../form'
import { FormButtonGroup } from '../form-button-group'
import { FormGrid } from '../form-grid'
import { Reset } from '../reset'
import { Submit } from '../submit'

defineOptions({
  name: 'FQueryForm',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<IQueryFormProps>(), {
  components: () => ({}),
  scope: () => ({}),
  gridProps: () => ({}),
  maxRows: 1,
  defaultExpanded: false,
  submitText: '查询',
  resetText: '重置',
  expandText: '展开',
  collapseText: '收起',
  showSubmit: true,
  showReset: true,
})

const attrs = useAttrs()
const slots = useSlots()
const prefixCls = `${stylePrefix}-query-form`
const FormGridColumn = FormGrid.GridColumn

const formProps = computed(() => ({
  feedbackLayout: 'terse',
  fullness: true,
  ...attrs,
  ...(props.form ? { form: props.form } : {}),
}))

const maxRowsRef = ref(props.maxRows)

const defaultShouldVisible: IGridOptions['shouldVisible'] = (node, grid) => {
  const maxRows = maxRowsRef.value ?? 1
  if (node.index === grid.childSize - 1)
    return true
  if (grid.maxRows === Infinity)
    return true

  const shadowRow = node.shadowRow ?? 0
  const withinRows = shadowRow < maxRows + 1
  if (!withinRows)
    return false

  const computeRows = grid.fullnessLastColumn ? grid.shadowRows - 1 : grid.shadowRows
  const isCollapsible = computeRows > maxRows
  if (!isCollapsible)
    return true

  const shadowColumn = node.shadowColumn ?? 1
  const span = node.span ?? 1
  const endColumn = shadowColumn + span - 1
  if (shadowRow === maxRows && endColumn === grid.columns)
    return false

  return true
}

const gridOptions: IGridOptions = {
  maxColumns: 4,
  maxWidth: 240,
  ...props.gridProps,
  maxRows: props.defaultExpanded ? Infinity : props.maxRows,
  shouldVisible: props.shouldVisible ?? props.gridProps?.shouldVisible ?? defaultShouldVisible,
}

const internalGrid = markRaw(new Grid(gridOptions))
const grid = props.grid ?? internalGrid

const expanded = ref(grid.maxRows === Infinity)
const gridType = ref<'incomplete-wrap' | 'collapsible' | 'complete-wrap'>('complete-wrap')

function updateType() {
  const realRows = grid.shadowRows
  const computeRows = grid.fullnessLastColumn ? grid.shadowRows - 1 : grid.shadowRows
  if (realRows < maxRowsRef.value + 1)
    gridType.value = 'incomplete-wrap'
  else if (computeRows > maxRowsRef.value)
    gridType.value = 'collapsible'
  else
    gridType.value = 'complete-wrap'
}

const dispose = autorun(() => {
  expanded.value = grid.maxRows === Infinity
  updateType()
})

onUnmounted(dispose)

function toggle() {
  grid.maxRows = grid.maxRows === Infinity ? maxRowsRef.value : Infinity
}

watch(
  () => props.maxRows,
  (value) => {
    maxRowsRef.value = value ?? 1
    if (grid.maxRows !== Infinity)
      grid.maxRows = maxRowsRef.value
    updateType()
  },
)

const hasDefaultSlot = computed(() => hasSlotContent(slots.default))

const schemaField = computed(() => {
  if (hasDefaultSlot.value || !props.schema)
    return null
  if (props.schemaField)
    return props.schemaField
  const { SchemaField } = createSchemaField({
    components: props.components,
    scope: props.scope,
  })
  return SchemaField
})
</script>

<template>
  <Form v-bind="formProps" :class="prefixCls">
    <FormGrid :grid="grid">
      <slot v-if="hasDefaultSlot" />
      <component
        :is="schemaField"
        v-else-if="schemaField"
        :schema="props.schema"
      />
      <FormGridColumn :grid-span="-1" :class="`${prefixCls}__actions`">
        <template v-if="gridType === 'incomplete-wrap'">
          <FormButtonGroup align-form-item inline>
            <slot
              name="actions"
              :expanded="expanded"
              :toggle="toggle"
              :type="gridType"
            >
              <Submit v-if="props.showSubmit" v-bind="props.submitProps">
                {{ props.submitText }}
              </Submit>
              <Reset v-if="props.showReset" v-bind="props.resetProps">
                {{ props.resetText }}
              </Reset>
            </slot>
          </FormButtonGroup>
        </template>
        <template v-else-if="gridType === 'collapsible'">
          <FormButtonGroup align="right" align-form-item inline>
            <slot
              name="actions"
              :expanded="expanded"
              :toggle="toggle"
              :type="gridType"
            >
              <Submit v-if="props.showSubmit" v-bind="props.submitProps">
                {{ props.submitText }}
              </Submit>
              <Reset v-if="props.showReset" v-bind="props.resetProps">
                {{ props.resetText }}
              </Reset>
            </slot>
            <slot
              name="collapse"
              :expanded="expanded"
              :toggle="toggle"
              :type="gridType"
            >
              <ElLink type="primary" :underline="false" @click="toggle">
                {{ expanded ? props.collapseText : props.expandText }}
              </ElLink>
            </slot>
          </FormButtonGroup>
        </template>
        <template v-else>
          <FormButtonGroup
            align="right"
            inline
            style="display: flex; width: 100%;"
          >
            <slot
              name="actions"
              :expanded="expanded"
              :toggle="toggle"
              :type="gridType"
            >
              <Submit v-if="props.showSubmit" v-bind="props.submitProps">
                {{ props.submitText }}
              </Submit>
              <Reset v-if="props.showReset" v-bind="props.resetProps">
                {{ props.resetText }}
              </Reset>
            </slot>
          </FormButtonGroup>
        </template>
      </FormGridColumn>
    </FormGrid>
  </Form>
</template>
