export interface IFormTab {
  name: string
  activeKey: string
  setActiveKey: (key: string) => void
}

export interface IFormTabProps {
  formTab?: IFormTab
  value?: string | number
}

export interface IFormTabPaneProps {
  key: string | number
}
