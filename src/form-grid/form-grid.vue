<script lang="ts" setup>
import type { IGridOptions } from '@silver-formily/grid'
import type { PropType } from 'vue'
import { markRaw } from '@formily/reactive'
import { Grid } from '@silver-formily/grid'
import { computed, provide, ref, watchEffect } from 'vue'
import { stylePrefix } from '../__builtins__'
import { FormGridSymbol } from './hooks'

defineOptions({
  name: 'FFormGrid',
})

const props = defineProps({
  columnGap: {
    type: Number,
  },
  rowGap: {
    type: Number,
  },
  minColumns: {
    type: [Number, Array],
  },
  minWidth: {
    type: [Number, Array],
  },
  maxColumns: {
    type: [Number, Array],
  },
  ssrColumns: {
    type: Number,
  },
  ssrTemplateColumns: {
    type: String,
  },
  deferVisibilityUntilHydration: {
    type: Boolean,
  },
  maxRows: {
    type: Number,
  },
  maxWidth: {
    type: [Number, Array],
  },
  breakpoints: {
    type: Array as PropType<number[]>,
  },
  colWrap: {
    type: Boolean,
    default: true,
  },
  strictAutoFit: {
    type: Boolean,
    default: false,
  },
  shouldVisible: {
    type: Function as PropType<IGridOptions['shouldVisible']>,
    default() {
      return () => true
    },
  },
  onDigest: {
    type: Function as PropType<IGridOptions['onDigest']>,
  },
  onInitialized: {
    type: Function as PropType<IGridOptions['onInitialized']>,
  },
  grid: {
    type: Object as PropType<Grid>,
  },
})

const prefixCls = `${stylePrefix}-form-grid`
const rootRef = ref<HTMLElement>()

const gridInstance = computed(() => {
  const { grid, ...restProps } = props
  const options = {
    columnGap: props?.columnGap ?? 8,
    rowGap: props.rowGap ?? 4,
    ...Object.fromEntries(
      Object.entries(restProps)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, v]),
    ),
  }
  return markRaw(grid ?? new Grid(options))
})

provide(FormGridSymbol, gridInstance)

watchEffect((onInvalidate) => {
  const container = rootRef.value
  if (!container)
    return

  const dispose = gridInstance.value.connect(container)
  onInvalidate(() => {
    dispose()
  })
})
</script>

<template>
  <div
    ref="rootRef"
    :class="prefixCls"
    :style="{
      gridTemplateColumns: gridInstance.templateColumns,
      gap: gridInstance.gap,
    }"
  >
    <slot />
  </div>
</template>
