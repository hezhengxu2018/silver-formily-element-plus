import QueryFormItemInner from './query-form-item.vue'
import './style.scss'

export type {
  IQueryFormItemProps,
  QueryFormItemMode,
  QueryFormItemPagination,
  QueryFormItemPaginationProps,
  QueryFormItemQueryFormProps,
  QueryFormItemRequest,
  QueryFormItemRequestResult,
  QueryFormItemRequestResultObject,
  QueryFormItemRequestSuccessPayload,
} from './types'

export const QueryFormItem = QueryFormItemInner

export default QueryFormItem
