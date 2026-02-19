import type { Form } from '@formily/core'
import type { Grid, IGridOptions } from '@formily/grid'
import type { ISchema } from '@formily/json-schema'
import type { Component } from 'vue'

// #region props
export interface IQueryFormProps {
  form?: Form
  schema?: ISchema
  schemaField?: Component
  components?: Record<string, Component>
  scope?: Record<string, any>
  grid?: Grid<HTMLElement>
  gridProps?: Partial<IGridOptions>
  maxRows?: number
  defaultExpanded?: boolean
  shouldVisible?: IGridOptions['shouldVisible']
  submitText?: string
  resetText?: string
  expandText?: string
  collapseText?: string
  showSubmit?: boolean
  showReset?: boolean
  submitProps?: Record<string, any>
  resetProps?: Record<string, any>
}
// #endregion props
