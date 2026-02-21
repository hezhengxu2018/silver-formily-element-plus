import type { ISchema } from '@formily/json-schema'
import type { IQueryFormLightProps, IQueryFormProps } from '../query-form'

export type QueryFormItemMode = 'default' | 'light'

export interface QueryFormItemPagination {
  current: number
  pageSize: number
}

export interface QueryFormItemRequestResultObject {
  data: any[]
  success: boolean
  total?: number
}

export type QueryFormItemRequest = (
  params: Record<string, any> & Partial<QueryFormItemPagination>,
) => Promise<QueryFormItemRequestResultObject>

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

export type QueryFormItemQueryProps = Partial<QueryFormDefaultProps & QueryFormLightProps>

export interface IQueryFormItemProps extends QueryFormItemQueryProps {
  mode?: QueryFormItemMode
  request?: QueryFormItemRequest
  querySchema?: ISchema
  paginationProps?: QueryFormItemPaginationProps
  immediate?: boolean
}

export interface QueryFormItemRequestSuccessPayload {
  values: Record<string, any>
  pagination?: QueryFormItemPagination
  dataSource: any[]
  total?: number
  result: QueryFormItemRequestResultObject
}
