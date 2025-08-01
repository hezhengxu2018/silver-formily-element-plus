import type { Column } from 'element-plus'

export interface ISelectTableProps {
  columns?: Column<any>[]
  mode?: 'multiple' | 'single'
  dataSource?: any[]
  optionAsValue?: boolean
  valueType?: 'all' | 'parent' | 'child' | 'path'
  loading?: boolean
  rowKey?: string
  clickRowToSelect?: boolean
  showAlertToolbar?: boolean
  value?: any
  data?: Record<string, any>[]
}
