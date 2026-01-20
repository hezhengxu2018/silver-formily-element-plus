import { connect, mapProps } from '@silver-formily/vue'
import FUpload from './upload.vue'

export const Upload = connect(
  FUpload,
  mapProps({ readOnly: 'readonly', dataSource: 'fileList' }),
)

export default Upload
