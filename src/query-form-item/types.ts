import type { ISchema } from '@formily/json-schema'
import type { IQueryFormLightProps, IQueryFormProps } from '../query-form'

export type QueryFormItemMode = 'default' | 'light'

export interface QueryFormItemPagination {
  current: number
  pageSize: number
}

export interface QueryFormItemRequestResultObject {
  dataSource?: any[]
  data?: any[]
  list?: any[]
  total?: number
}

export type QueryFormItemRequestResult = any[] | QueryFormItemRequestResultObject

export type QueryFormItemRequest = (
  values: Record<string, any>,
  pagination?: QueryFormItemPagination,
) => Promise<QueryFormItemRequestResult>

export interface QueryFormItemPaginationProps {
  enabled?: boolean
  currentPage?: number
  pageSize?: number
  pageSizes?: number[]
  layout?: string
  background?: boolean
  [key: string]: any
}

type QueryFormDefaultProps = Omit<IQueryFormProps, 'schema'>
type QueryFormLightProps = Omit<IQueryFormLightProps, 'schema'>

export type QueryFormItemQueryFormProps = Partial<QueryFormDefaultProps & QueryFormLightProps> & {
  schema?: ISchema
  onAutoSubmit?: (values: Record<string, any>) => Promise<any> | any
  [key: string]: any
}

export interface IQueryFormItemProps {
  mode?: QueryFormItemMode
  request?: QueryFormItemRequest
  querySchema?: ISchema
  queryFormProps?: QueryFormItemQueryFormProps
  paginationProps?: QueryFormItemPaginationProps
  immediate?: boolean
}

export interface QueryFormItemRequestSuccessPayload {
  values: Record<string, any>
  pagination?: QueryFormItemPagination
  dataSource: any[]
  total?: number
  result: QueryFormItemRequestResult
}
