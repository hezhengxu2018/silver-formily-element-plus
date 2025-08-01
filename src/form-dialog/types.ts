import type { Form, IFormProps } from '@formily/core'
import type { IMiddleware } from '@formily/shared'
import type { ButtonProps, DialogProps } from 'element-plus'
import type { SlotsType, VNode } from 'vue'

// #region props
export type IFormDialogProps = Partial<DialogProps> & {
  cancelText?: string
  cancelButtonProps?: ButtonProps
  okText?: string
  okButtonProps?: ButtonProps
  loadingText?: string
}
// #endregion props

// #region slots
export interface FormDialogSlotProps {
  resolve: (type?: string) => void
  reject: () => void
  form: Form
}

export interface FormDialogSlots {
  header?: (props: FormDialogSlotProps) => VNode
  default?: () => VNode
  footer?: (props: FormDialogSlotProps) => VNode
}
// #endregion slots

export type FormDialogSlotContent = SlotsType<FormDialogSlots> | {
  [key in keyof FormDialogSlots]?: FormDialogSlots[key]
}

// #region iformdialog
export interface IFormDialog {
  forOpen: (middleware: IMiddleware<IFormProps>) => IFormDialog
  forConfirm: (middleware: IMiddleware<IFormProps>) => IFormDialog
  forCancel: (middleware: IMiddleware<IFormProps>) => IFormDialog
  [key: `for${string}`]: (middleware: IMiddleware<IFormProps>) => IFormDialog
  open: (props?: IFormProps) => Promise<any>
  close: () => void
}
// #endregion iformdialog
