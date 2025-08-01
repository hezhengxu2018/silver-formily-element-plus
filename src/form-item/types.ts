export interface IFormItemProps {
  label?: string
  for?: string
  tooltip?: string
  addonBefore?: string
  addonAfter?: string
  extra?: string
  feedbackText?: string
  feedbackStatus?: 'error' | 'warning' | 'success' | 'pending'
  asterisk?: boolean
  colon?: boolean
  labelAlign?: 'right' | 'left'
  wrapperAlign?: 'right' | 'left'
  labelWrap?: boolean
  labelWidth?: number
  wrapperWidth?: number
  wrapperWrap?: boolean
  labelCol?: number
  wrapperCol?: number
  fullness?: boolean
  size?: 'small' | 'default' | 'large'
  layout?:
    | 'vertical'
    | 'horizontal'
    | 'inline'
    | ('vertical' | 'horizontal' | 'inline')[]
  feedbackLayout?: 'loose' | 'terse' | 'popover'
  tooltipLayout?: 'icon' | 'text'
}
