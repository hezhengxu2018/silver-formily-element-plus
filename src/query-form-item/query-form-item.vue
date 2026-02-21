<script setup lang="ts">
import type { Form } from '@formily/core'
import type { ISchema } from '@formily/json-schema'
import type { PropType } from 'vue'
import type {
  QueryFormItemMode,
  QueryFormItemPaginationProps,
  QueryFormItemRequest,
  QueryFormItemRequestSuccessPayload,
} from './types'
import { createForm } from '@formily/core'
import { toJS } from '@formily/reactive'
import { useField } from '@silver-formily/vue'
import { ElPagination } from 'element-plus'
import { computed, onMounted, ref, watch } from 'vue'
import { stylePrefix, useCleanAttrs } from '../__builtins__'
import { QueryForm } from '../query-form'

defineOptions({
  name: 'FQueryFormItem',
  inheritAttrs: false,
})

const props = defineProps({
  mode: {
    type: String as PropType<QueryFormItemMode>,
    default: 'default',
  },
  request: Function as PropType<QueryFormItemRequest>,
  querySchema: Object as PropType<ISchema>,
  paginationProps: {
    type: Object as PropType<QueryFormItemPaginationProps>,
    default: () => ({}),
  },
  immediate: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits<{
  (e: 'requestSuccess', payload: QueryFormItemRequestSuccessPayload): void
  (e: 'requestFailed', error: any): void
}>()

const defaultPaginationProps: Required<Pick<QueryFormItemPaginationProps, 'enabled' | 'currentPage' | 'pageSize' | 'pageSizes' | 'layout' | 'background'>> = {
  enabled: true,
  currentPage: 1,
  pageSize: 10,
  pageSizes: [10, 20, 50, 100],
  layout: 'total, prev, pager, next',
  background: true,
}

const { props: cleanAttrs } = useCleanAttrs(['modelValue', 'onUpdate:modelValue'])
const fieldRef = useField()
const internalQueryForm = createForm()
const prefixCls = `${stylePrefix}-query-form-item`

const normalizedPaginationProps = computed(() => {
  const {
    enabled,
    currentPage,
    pageSize,
    ...bindings
  } = {
    ...defaultPaginationProps,
    ...props.paginationProps,
  }

  return {
    enabled: enabled !== false,
    currentPage,
    pageSize,
    bindings,
  }
})

const currentPageRef = ref(normalizedPaginationProps.value.currentPage)
const pageSizeRef = ref(normalizedPaginationProps.value.pageSize)
const totalRef = ref(0)
const currentRequestId = ref(0)

const activeQueryForm = computed<Form>(() => (cleanAttrs.value.form) ?? internalQueryForm)

const queryFormBindings = computed(() => ({
  ...cleanAttrs.value,
  schema: props.querySchema,
  onAutoSubmit: handleQuerySubmit,
  form: activeQueryForm.value,
}))

async function executeRequest() {
  if (!props.request)
    return

  const field = fieldRef.value as any
  const requestId = ++currentRequestId.value
  const queryValues = toJS((activeQueryForm.value.values) ?? {}) as Record<string, any>
  const pagination = normalizedPaginationProps.value.enabled
    ? {
        current: currentPageRef.value,
        pageSize: pageSizeRef.value,
      }
    : undefined
  const requestParams = pagination
    ? {
        ...queryValues,
        current: pagination.current,
        pageSize: pagination.pageSize,
      }
    : queryValues

  field.loading = true
  try {
    const result = await props.request(requestParams)

    if (requestId !== currentRequestId.value)
      return

    if (result.success !== true) {
      emit('requestFailed', result)
      return
    }

    field.dataSource = result.data
    totalRef.value = typeof result.total === 'number' ? result.total : result.data.length

    emit('requestSuccess', {
      values: queryValues,
      pagination,
      dataSource: result.data,
      total: totalRef.value,
      result,
    })
  }
  catch (error) {
    if (requestId !== currentRequestId.value)
      return
    emit('requestFailed', error)
  }
  finally {
    if (requestId === currentRequestId.value)
      field.loading = false
  }
}

function handleCurrentPageChange(page: number) {
  currentPageRef.value = page
  void executeRequest()
}

function handlePageSizeChange(pageSize: number) {
  pageSizeRef.value = pageSize
  currentPageRef.value = 1
  void executeRequest()
}

async function handleQuerySubmit() {
  if (normalizedPaginationProps.value.enabled)
    currentPageRef.value = 1

  await executeRequest()
}

onMounted(() => {
  if (props.immediate)
    void executeRequest()
})

watch(normalizedPaginationProps, ({ currentPage, pageSize }) => {
  currentPageRef.value = currentPage
  pageSizeRef.value = pageSize
})
</script>

<template>
  <div :class="prefixCls">
    <component
      :is="props.mode === 'light' ? QueryForm.Light : QueryForm"
      v-bind="queryFormBindings"
    />
    <div :class="`${prefixCls}__content`">
      <slot />
    </div>
    <ElPagination
      v-if="normalizedPaginationProps.enabled"
      v-model:current-page="currentPageRef"
      v-model:page-size="pageSizeRef"
      :class="`${prefixCls}__pagination`"
      v-bind="normalizedPaginationProps.bindings"
      :total="totalRef"
      @current-change="handleCurrentPageChange"
      @size-change="handlePageSizeChange"
    />
  </div>
</template>
