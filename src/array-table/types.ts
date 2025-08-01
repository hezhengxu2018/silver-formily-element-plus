import type { PaginationProps } from 'element-plus'

export interface IArrayTableProps {
  value?: any[]
  pagination?: boolean
  paginationProps?: Partial<PaginationProps>
}
