import { connect, mapProps } from '@formily/vue'
import InnerSelectTable from './select-table.vue'
import './style.scss'

const SelectTable = connect(
  InnerSelectTable,
  mapProps({ dataSource: 'dataSource', loading: 'loading' }),
)

export { SelectTable }

export default SelectTable
