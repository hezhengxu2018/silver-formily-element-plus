<script setup lang="ts">
import type { GridNode, IGridOptions } from '@formily/grid'
import type { ISchema } from '@formily/json-schema'
import type { IQueryFormProps } from './types'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import { Grid } from '@formily/grid'
import { autorun, markRaw } from '@formily/reactive'
import { createSchemaField, useField, useFieldSchema, useForm } from '@silver-formily/vue'
import { ElIcon, ElLink } from 'element-plus'
import { computed, onUnmounted, ref, useSlots } from 'vue'
import { compatibleUnderlineProp, stylePrefix, useCleanAttrs } from '../__builtins__'
import { Form } from '../form'
import { FormButtonGroup } from '../form-button-group'
import { FormGrid } from '../form-grid'
import { Reset } from '../reset'
import { Submit } from '../submit'
import { mergeQueryFormComponents } from './default-components'

defineOptions({
  name: 'FQueryForm',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<IQueryFormProps>(), {
  components: () => ({}),
  gridProps: () => ({}),
  defaultExpanded: false,
  actionsAtRowEnd: false,
  submitText: '查询',
  resetText: '重置',
  expandText: '展开',
  collapseText: '收起',
  showSubmit: true,
  showReset: true,
})

const { props: formProps } = useCleanAttrs(['modelValue', 'onUpdate:modelValue'])
const slots = useSlots()
const prefixCls = `${stylePrefix}-query-form`
const FormGridColumn = FormGrid.GridColumn

const innerFormProps = computed(() => ({
  fullness: true,
  ...formProps.value,
}))

const COLLAPSED_ROWS = 1
const fieldRef = useField()
const fieldSchemaRef = useFieldSchema()
const formRef = useForm()

interface SchemaEntry { name?: string, schema: ISchema }

const schemaList = computed<SchemaEntry[]>(() => {
  const schema = fieldSchemaRef.value ?? props.schema
  /* istanbul ignore next -- @preserve defensive: schema can be temporarily absent in external field-schema lifecycle */
  if (!schema)
    return []
  if (typeof (schema as any).mapProperties === 'function') {
    const list: SchemaEntry[] = []
    ;(schema as any).mapProperties((childSchema: ISchema, name: string) => {
      list.push({ schema: childSchema, name })
    })
    return list
  }
  /* istanbul ignore next -- @preserve defensive: schema may not declare properties */
  return Object.entries(schema.properties ?? {}).map(([name, childSchema]) => ({
    name,
    schema: childSchema,
  }))
})

function resolveField(name?: string | number) {
  /* istanbul ignore if -- @preserve defensive: invalid schema node name */
  if (!name)
    return
  /* istanbul ignore if -- @preserve defensive: fieldRef exists only under specific schema mount tree */
  if (fieldRef.value) {
    return fieldRef.value.query(fieldRef.value.address.concat(name)).take()
  }
  const form = formProps.value.form ?? formRef?.value
  return form?.query(name).take()
}

function createVisibleContext(
  node: GridNode,
  grid: Grid<HTMLElement>,
  collapsedOverride?: boolean,
) {
  const index = node.index ?? 0
  const entry = schemaList.value[index]
  const schema = entry?.schema
  const name = entry?.name ?? schema?.name
  return {
    field: resolveField(name),
    schema,
    index,
    node,
    grid,
    collapsed: collapsedOverride ?? grid.maxRows !== Infinity,
    breakpoint: grid.breakpoint,
  }
}

function defaultVisibleWhen(context: ReturnType<typeof createVisibleContext>) {
  if (!context.collapsed)
    return true

  const shadowRow = context.node.shadowRow ?? 0
  const withinRows = shadowRow < COLLAPSED_ROWS + 1
  if (!withinRows)
    return false

  const isCollapsible = getFieldRowCount(context.grid) > COLLAPSED_ROWS
  if (!isCollapsible)
    return true

  /* istanbul ignore next -- @preserve defensive: shadowColumn may be absent before layout complete */
  const shadowColumn = context.node.shadowColumn ?? 1
  /* istanbul ignore next -- @preserve defensive: span fallback for incomplete runtime node metadata */
  const span = context.node.span ?? 1
  const endColumn = shadowColumn + span - 1
  if (shadowRow === COLLAPSED_ROWS && endColumn === context.grid.columns)
    return false

  return true
}

function resolveVisibleWhen(context: ReturnType<typeof createVisibleContext>) {
  const visible = props.visibleWhen
    ? props.visibleWhen(context)
    : defaultVisibleWhen(context)
  return visible !== false
}

function isActionsNode(node: GridNode, grid: Grid<HTMLElement>) {
  if (node.element) {
    return node.element.dataset.queryFormActions !== undefined
  }
  return node.index === grid.childSize - 1
}

function getFieldRowCount(grid: Grid<HTMLElement>) {
  /* istanbul ignore next -- @preserve defensive: children is runtime-populated by @formily/grid */
  const rows = (grid.children ?? [])
    .filter(node => !isActionsNode(node, grid))
    .map(node => node.shadowRow ?? 0)
  return new Set(rows).size
}

const defaultShouldVisible: IGridOptions['shouldVisible'] = (node, grid) => {
  if (isActionsNode(node, grid))
    return true
  return resolveVisibleWhen(createVisibleContext(node, grid))
}

/* istanbul ignore next -- @preserve defensive: kept for optional external props compatibility */
const restGridProps = props.gridProps ?? {}

const gridOptions: IGridOptions = {
  maxColumns: 4,
  ...restGridProps,
  maxRows: props.defaultExpanded ? Infinity : COLLAPSED_ROWS,
  shouldVisible: defaultShouldVisible,
}

const internalGrid = markRaw(new Grid(gridOptions))
const grid = internalGrid

const expanded = ref(grid.maxRows === Infinity)
const gridType = ref<'incomplete-wrap' | 'collapsible' | 'complete-wrap'>('complete-wrap')

function updateType() {
  if (!props.visibleWhen) {
    gridType.value = getFieldRowCount(grid) > COLLAPSED_ROWS
      ? 'collapsible'
      : 'incomplete-wrap'
    return
  }

  const nodes = grid.children ?? []
  const hasHiddenInCollapsed = nodes.some((node) => {
    if (isActionsNode(node, grid))
      return false
    return !resolveVisibleWhen(createVisibleContext(node, grid, true))
  })
  /* istanbul ignore next -- @preserve layout branch depends on runtime grid measurement in browser */
  if (hasHiddenInCollapsed) {
    gridType.value = 'collapsible'
    return
  }
  const realRows = grid.shadowRows
  gridType.value = realRows < COLLAPSED_ROWS + 1 ? 'incomplete-wrap' : 'complete-wrap'
}

const dispose = autorun(() => {
  expanded.value = grid.maxRows === Infinity
  updateType()
})

onUnmounted(dispose)

function toggle() {
  grid.maxRows = grid.maxRows === Infinity ? COLLAPSED_ROWS : Infinity
}

const hasDefaultSlot = Boolean(slots.default)
const mergedComponents = mergeQueryFormComponents(props.components)
const schemaField = hasDefaultSlot || !props.schema
  ? null
  : (props.schemaField ?? createSchemaField({
      components: mergedComponents,
      scope: props.scope,
    }).SchemaField)
</script>

<template>
  <Form v-bind="innerFormProps" :class="prefixCls">
    <FormGrid :grid="grid">
      <slot v-if="hasDefaultSlot" />
      <component
        :is="schemaField"
        v-else-if="schemaField"
        :schema="props.schema"
      />
      <FormGridColumn
        :grid-span="-1"
        data-query-form-actions
        :class="[
          `${prefixCls}__actions`,
          props.actionsAtRowEnd && `${prefixCls}__actions--row-end`,
        ]"
      >
        <template v-if="gridType === 'incomplete-wrap'">
          <FormButtonGroup
            :align="props.actionsAtRowEnd ? 'right' : 'left'"
            align-form-item
            inline
            :style="props.actionsAtRowEnd ? { width: '100%' } : undefined"
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
        <template v-else-if="gridType === 'collapsible'">
          <FormButtonGroup
            :align="props.actionsAtRowEnd ? 'right' : 'left'"
            align-form-item
            inline
            :style="props.actionsAtRowEnd ? { width: '100%' } : undefined"
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
            <slot
              name="collapse"
              :expanded="expanded"
              :toggle="toggle"
              :type="gridType"
            >
              <ElLink
                type="primary"
                :underline="compatibleUnderlineProp()"
                :class="`${prefixCls}__collapse-link`"
                @click="toggle"
              >
                {{ expanded ? props.collapseText : props.expandText }}
                <ElIcon :class="`${prefixCls}__collapse-icon`">
                  <ArrowUp v-if="expanded" />
                  <ArrowDown v-else />
                </ElIcon>
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
