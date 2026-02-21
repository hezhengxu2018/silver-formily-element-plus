<script setup lang="ts">
import type { Form } from '@formily/core'
import type { ISchema } from '@formily/json-schema'
import type { PropType } from 'vue'
import type {
  QueryFormItemMode,
  QueryFormItemPaginationMap,
  QueryFormItemPaginationProps,
  QueryFormItemQueryProps,
  QueryFormItemRequest,
  QueryFormItemRequestSuccessPayload,
} from './types'
import { createForm } from '@formily/core'
import { isNum } from '@formily/shared'
import { useField } from '@silver-formily/vue'
import { ElPagination } from 'element-plus'
import { computed, onMounted, ref, watch } from 'vue'
import { stylePrefix, useCleanAttrs } from '../__builtins__'
import { FormBaseItem } from '../form-item'
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
    type: Object as PropType<QueryFormItemQueryProps>,
    default: () => ({}),
  },
  pagination: {
    type: Boolean,
    default: true,
  },
  paginationProps: {
    type: Object as PropType<QueryFormItemPaginationProps>,
    default: () => ({}),
  },
  paginationMap: {
    type: Object as PropType<QueryFormItemPaginationMap>,
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

const defaultPaginationProps: Required<Pick<QueryFormItemPaginationProps, 'currentPage' | 'pageSize' | 'pageSizes' | 'layout' | 'background'>> = {
  currentPage: 1,
  pageSize: 10,
  pageSizes: [10, 20, 50, 100],
  layout: 'total, prev, pager, next',
  background: true,
}
const defaultPaginationRequestMapping: Required<QueryFormItemPaginationMap> = {
  current: 'current',
  pageSize: 'pageSize',
}

const fieldRef = useField()
const internalQueryForm = createForm()
const prefixCls = `${stylePrefix}-query-form-item`
const { props: cleanAttrs } = useCleanAttrs()

const formItemBindings = computed(() => {
  const { form, ...bindings } = cleanAttrs.value
  return bindings
})

const initialPaginationProps = {
  ...defaultPaginationProps,
  ...props.paginationProps,
}
const paginationBindings = computed(() => {
  const {
    currentPage,
    pageSize,
    ...bindings
  } = {
    ...defaultPaginationProps,
    ...props.paginationProps,
  }
  return bindings
})

const currentPageRef = ref(initialPaginationProps.currentPage)
const pageSizeRef = ref(initialPaginationProps.pageSize)
const totalRef = ref(0)
const currentRequestId = ref(0)

const activeQueryForm = computed<Form>(() => (
  props.queryFormProps.form
  ?? (cleanAttrs.value.form as Form | undefined)
  ?? internalQueryForm
))

const queryFormBindings = computed(() => ({
  ...props.queryFormProps,
  schema: props.querySchema,
  onAutoSubmit: handleQuerySubmit,
  form: activeQueryForm.value,
  resetProps: props.mode === 'default'
    ? {
        ...props.queryFormProps.resetProps,
        onClick: handleQueryReset,
      }
    : props.queryFormProps.resetProps,
}))

async function executeRequest() {
  if (!props.request)
    return

  const field = fieldRef.value as any
  const requestId = ++currentRequestId.value
  const queryValues = activeQueryForm.value.values
  const paginationData = props.pagination
    ? {
        current: currentPageRef.value,
        pageSize: pageSizeRef.value,
      }
    : undefined
  const requestParams = paginationData
    ? {
        ...queryValues,
        [(props.paginationMap.current ?? defaultPaginationRequestMapping.current)]: paginationData.current,
        [(props.paginationMap.pageSize ?? defaultPaginationRequestMapping.pageSize)]: paginationData.pageSize,
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
    totalRef.value = isNum(result.total) ? result.total : result.data.length

    emit('requestSuccess', {
      values: queryValues,
      pagination: paginationData,
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

async function handleQuerySubmit() {
  if (props.pagination && currentPageRef.value !== 1) {
    currentPageRef.value = 1
    return
  }

  await executeRequest()
}

function handleQueryReset(event: MouseEvent) {
  const userOnClick = props.queryFormProps.resetProps?.onClick as ((event: MouseEvent) => void | boolean) | undefined
  const result = userOnClick?.(event)
  if (result === false)
    return false

  Promise.resolve().then(() => {
    void handleQuerySubmit()
  })

  return result
}

onMounted(() => {
  if (props.immediate)
    void executeRequest()
})

watch([currentPageRef, pageSizeRef], ([currentPage, pageSize], [previousPage, previousPageSize]) => {
  if (!props.pagination)
    return

  const currentChanged = currentPage !== previousPage
  const pageSizeChanged = pageSize !== previousPageSize

  if (!currentChanged && !pageSizeChanged)
    return

  if (pageSizeChanged && currentPage !== 1) {
    currentPageRef.value = 1
    return
  }

  void executeRequest()
})
</script>

<template>
  <FormBaseItem v-bind="formItemBindings">
    <div :class="prefixCls">
      <component
        :is="props.mode === 'light' ? QueryForm.Light : QueryForm"
        v-bind="queryFormBindings"
      />
      <div :class="`${prefixCls}__content`">
        <slot />
      </div>
      <ElPagination
        v-if="props.pagination"
        v-model:current-page="currentPageRef"
        v-model:page-size="pageSizeRef"
        :class="`${prefixCls}__pagination`"
        v-bind="paginationBindings"
        :total="totalRef"
      />
    </div>
  </FormBaseItem>
</template>
