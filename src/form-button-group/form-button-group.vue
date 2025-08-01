<script lang="ts" setup>
import { ElSpace } from 'element-plus'
import FormItem from '../form-item/index'
import { prefixCls } from './utils'

defineOptions({
  name: 'FFormButtonGroup',
  inheritAttrs: false,
})

const props = defineProps({
  align: {
    type: String,
    default: 'left',
  },
  gutter: {
    type: Number,
    default: 8,
  },
  alignFormItem: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <FormItem
    v-if="props.alignFormItem"
    :colon="false"
    label=" "
    v-bind="$attrs"
    :class="prefixCls"
    :style="{
      width: '100%',
    }"
  >
    <ElSpace :size="props.gutter">
      <slot />
    </ElSpace>
  </FormItem>
  <ElSpace
    v-else
    v-bind="$attrs"
    :class="prefixCls"
    :style="{
      justifyContent: props.align === 'left'
        ? 'flex-start'
        : (props.align === 'right'
          ? 'flex-end'
          : 'center'),
      display: 'flex',
    }"
    :size="props.gutter"
  >
    <slot />
  </ElSpace>
</template>
