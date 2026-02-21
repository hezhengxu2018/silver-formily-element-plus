import QueryFormItemInner from './query-form-item.vue'
import './style.scss'

export type {
  IQueryFormItemProps,
  QueryFormItemMode,
  QueryFormItemPagination,
  QueryFormItemPaginationProps,
  QueryFormItemQueryProps,
  QueryFormItemRequest,
  QueryFormItemRequestResultObject,
  QueryFormItemRequestSuccessPayload,
} from './types'

export const QueryFormItem = QueryFormItemInner

export default QueryFormItem
