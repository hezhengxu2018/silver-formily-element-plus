<script setup lang="ts">
import type { ISchema } from '@formily/json-schema'
import type { PropType } from 'vue'
import type {
  QueryFormItemMode,
  QueryFormItemPaginationProps,
  QueryFormItemQueryFormProps,
  QueryFormItemRequest,
  QueryFormItemRequestResult,
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
  queryFormProps: {
    type: Object as PropType<QueryFormItemQueryFormProps>,
    default: () => ({}),
  },
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
  layout: 'total, sizes, prev, pager, next',
  background: true,
}

const { props: cleanAttrs } = useCleanAttrs(['modelValue', 'onUpdate:modelValue'])
const fieldRef = useField()
const queryForm = createForm()
const prefixCls = `${stylePrefix}-query-form-item`

const normalizedPaginationProps = computed(() => ({
  ...defaultPaginationProps,
  ...props.paginationProps,
}))

const currentPageRef = ref(normalizedPaginationProps.value.currentPage)
const pageSizeRef = ref(normalizedPaginationProps.value.pageSize)
const totalRef = ref(0)
const currentRequestId = ref(0)

const queryFormComponent = computed(() => props.mode === 'light' ? QueryForm.Light : QueryForm)
const paginationVisible = computed(() => normalizedPaginationProps.value.enabled !== false)
const resolvedQuerySchema = computed(() => props.querySchema ?? props.queryFormProps.schema)

const paginationBindings = computed(() => {
  const rest = { ...normalizedPaginationProps.value }
  delete rest.enabled
  delete rest.currentPage
  delete rest.pageSize
  return rest
})

const queryFormProps = computed(() => ({
  ...props.queryFormProps,
  schema: resolvedQuerySchema.value,
  onAutoSubmit: handleQuerySubmit,
}))

const queryFormBindings = computed(() => ({
  ...cleanAttrs.value,
  ...queryFormProps.value,
  form: queryForm,
}))

function normalizeRequestResult(result: QueryFormItemRequestResult): { dataSource: any[], total?: number } {
  if (Array.isArray(result)) {
    return {
      dataSource: result,
      total: result.length,
    }
  }

  if (result && typeof result === 'object') {
    let dataSource: any[] = []
    if (Array.isArray(result.dataSource))
      dataSource = result.dataSource
    else if (Array.isArray(result.list))
      dataSource = result.list
    else if (Array.isArray(result.data))
      dataSource = result.data

    return {
      dataSource,
      total: typeof result.total === 'number' ? result.total : undefined,
    }
  }

  return { dataSource: [] }
}

function getQueryValues(values?: Record<string, any>) {
  const rawValues = values ?? (queryForm.values as Record<string, any>) ?? {}
  return toJS(rawValues) as Record<string, any>
}

function setFieldLoading(loading: boolean) {
  const field = fieldRef.value as any
  if (field)
    field.loading = loading
}

function setFieldDataSource(dataSource: any[]) {
  const field = fieldRef.value as any
  if (!field)
    return

  if (typeof field.setDataSource === 'function') {
    field.setDataSource(dataSource)
    return
  }

  field.dataSource = dataSource
}

async function executeRequest(values?: Record<string, any>) {
  if (!props.request)
    return

  const requestId = ++currentRequestId.value
  const queryValues = getQueryValues(values)
  const pagination = paginationVisible.value
    ? {
        current: currentPageRef.value,
        pageSize: pageSizeRef.value,
      }
    : undefined

  setFieldLoading(true)
  try {
    const result = paginationVisible.value
      ? await props.request(queryValues, pagination)
      : await props.request(queryValues)

    if (requestId !== currentRequestId.value)
      return

    const normalized = normalizeRequestResult(result)
    setFieldDataSource(normalized.dataSource)
    totalRef.value = normalized.total ?? normalized.dataSource.length

    emit('requestSuccess', {
      values: queryValues,
      pagination,
      dataSource: normalized.dataSource,
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
      setFieldLoading(false)
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

async function handleQuerySubmit(values: Record<string, any>) {
  if (paginationVisible.value) {
    currentPageRef.value = 1
  }
  await executeRequest(values)
}

onMounted(() => {
  if (props.immediate) {
    void executeRequest()
  }
})

watch(() => normalizedPaginationProps.value.currentPage, (currentPage) => {
  currentPageRef.value = currentPage
})

watch(() => normalizedPaginationProps.value.pageSize, (pageSize) => {
  pageSizeRef.value = pageSize
})
</script>

<template>
  <div :class="prefixCls">
    <component
      :is="queryFormComponent"
      v-bind="queryFormBindings"
    />
    <div :class="`${prefixCls}__content`">
      <slot />
    </div>
    <ElPagination
      v-if="paginationVisible"
      v-model:current-page="currentPageRef"
      v-model:page-size="pageSizeRef"
      :class="`${prefixCls}__pagination`"
      v-bind="paginationBindings"
      :total="totalRef"
      @current-change="handleCurrentPageChange"
      @size-change="handlePageSizeChange"
    />
  </div>
</template>
