import { connect, mapProps } from '@silver-formily/vue'
import { ElTransfer } from 'element-plus'

export type TransferProps = typeof ElTransfer

export const Transfer = connect(
  ElTransfer,
  mapProps({ dataSource: 'data' }),
)

export default Transfer
