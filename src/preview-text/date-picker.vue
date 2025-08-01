<script setup lang="ts">
import { dayjs, ElSpace, ElTag, ElText } from 'element-plus'
import { computed } from 'vue'
import { stylePrefix, useCleanAttrs } from '../__builtins__'
import { usePreviewConfig } from './utils'

defineOptions({
  name: 'FPreviewTextDatePicker',
  inheritAttrs: false,
})

const props = defineProps<{
  value?: any
}>()
const { props: attrs } = useCleanAttrs()
const prefixCls = `${stylePrefix}-preview-text`
const { spaceProps, textProps, tagProps, placeholder } = usePreviewConfig()

function getFormatByType(type: string): string {
  switch (type) {
    case 'year': {
      return 'YYYY'
    }
    case 'years': {
      return 'YYYY'
    }
    case 'month': {
      return 'YYYY-MM'
    }
    case 'months': {
      return 'YYYY-MM'
    }
    case 'week': {
      return '[Week] ww'
    }
    case 'date': {
      return 'YYYY-MM-DD'
    }
    case 'dates': {
      return 'YYYY-MM-DD'
    }
    case 'datetime': {
      return 'YYYY-MM-DD HH:mm:ss'
    }
    case 'daterange': {
      return 'YYYY-MM-DD'
    }
    case 'monthrange': {
      return 'YYYY-MM'
    }
    case 'yearrange': {
      return 'YYYY'
    }
    case 'datetimerange': {
      return 'YYYY-MM-DD HH:mm:ss'
    }
    default: {
      return 'YYYY-MM-DD'
    }
  }
}
const type = computed(() => attrs.value.type || 'date')
const format = computed(() => attrs.value.format || getFormatByType(type.value))
</script>

<template>
  <div :class="prefixCls">
    <template v-if="props.value">
      <template v-if="type.endsWith('range')">
        <ElText v-bind="textProps">
          {{ props.value[0] ? dayjs(props.value[0]).format(format) : placeholder }}
          {{ attrs.rangeSeparator ?? '~' }}
          {{ props.value[1] ? dayjs(props.value[1]).format(format) : placeholder }}
        </ElText>
      </template>
      <template v-else-if="type.endsWith('s')">
        <ElSpace v-bind="spaceProps">
          <ElTag v-for="i of props.value" :key="i" v-bind="tagProps">
            {{ dayjs(i).format(format) }}
          </ElTag>
        </ElSpace>
      </template>
      <template v-else>
        <ElText v-bind="textProps">
          {{ dayjs(props.value).format(format) }}
        </ElText>
      </template>
    </template>
    <template v-else>
      <ElText v-bind="textProps">
        {{ placeholder }}
      </ElText>
    </template>
  </div>
</template>
