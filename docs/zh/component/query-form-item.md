# QueryFormItem

> 基于 `QueryForm` 的装饰器组件，用于按条件请求并更新当前字段的 `dataSource`。

::: tip 提示

- 组件仅支持分组参数：`queryFormProps` 与 `paginationProps`。
- `mode="light"` 时，内部渲染 `QueryForm.Light`。
- `request` 返回结果会自动写入当前字段的 `dataSource`。

:::

## Demo

### SelectTable + Pagination

:::demo

query-form-item/markup-schema

:::

### Tree + Light (No Pagination)

:::demo

query-form-item/light-with-tree

:::

## API

### QueryFormItem Props

| 属性名            | 说明                                                       | 类型                                                           | 默认值                                                                                                                                       |
| ----------------- | ---------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `mode`            | 查询模式                                                   | `'default' \| 'light'`                                         | `'default'`                                                                                                                                  |
| `request`         | 查询函数；当分页开启时第二个参数为 `{ current, pageSize }` | `(values, pagination?) => Promise<QueryFormItemRequestResult>` | -                                                                                                                                            |
| `querySchema`     | 查询区 Schema，优先级高于 `queryFormProps.schema`          | `ISchema`                                                      | -                                                                                                                                            |
| `queryFormProps`  | 透传给 `QueryForm` / `QueryForm.Light` 的参数              | `QueryFormItemQueryFormProps`                                  | `{}`                                                                                                                                         |
| `paginationProps` | 分页配置，透传给 `ElPagination`                            | `QueryFormItemPaginationProps`                                 | `{ enabled: true, currentPage: 1, pageSize: 10, pageSizes: [10, 20, 50, 100], layout: 'total, sizes, prev, pager, next', background: true }` |
| `immediate`       | 挂载后是否立即执行一次查询                                 | `boolean`                                                      | `true`                                                                                                                                       |

### queryFormProps

`queryFormProps` 会按 `mode` 透传：

- `mode='default'` 透传到 `QueryForm`
- `mode='light'` 透传到 `QueryForm.Light`

| 参数名            | 说明                                    | 类型                             | 默认值  |
| ----------------- | --------------------------------------- | -------------------------------- | ------- |
| `schema`          | 查询区 Schema（低于外层 `querySchema`） | `ISchema`                        | -       |
| `schemaField`     | 自定义 SchemaField                      | `Component`                      | -       |
| `components`      | 查询区组件映射                          | `Record<string, Component>`      | -       |
| `scope`           | 查询区作用域                            | `Record<string, any>`            | -       |
| `throttleWait`    | Light 模式自动查询节流时间（毫秒）      | `number`                         | `300`   |
| `gridProps`       | Default 模式网格配置                    | `IQueryFormProps['gridProps']`   | -       |
| `defaultExpanded` | Default 模式默认展开                    | `boolean`                        | `false` |
| `showToggle`      | Default 模式是否显示展开/收起           | `boolean`                        | `true`  |
| `visibleWhen`     | Default 模式字段显示判断函数            | `IQueryFormProps['visibleWhen']` | -       |
| `submitText`      | Default 模式查询按钮文本                | `string`                         | `查询`  |
| `resetText`       | Default 模式重置按钮文本                | `string`                         | `重置`  |
| `submitProps`     | Default 模式查询按钮透传参数            | `Record<string, any>`            | -       |
| `resetProps`      | Default 模式重置按钮透传参数            | `Record<string, any>`            | -       |
| `onAutoSubmit`    | 查询自动提交回调                        | `(values) => any`                | -       |

::: warning 注意
`QueryFormItem` 内部使用 `onAutoSubmit` 触发查询，请不要在 `queryFormProps` 中覆盖 `onAutoSubmit`。
:::

### paginationProps

| 参数名        | 说明                     | 类型                  | 默认值                              |
| ------------- | ------------------------ | --------------------- | ----------------------------------- |
| `enabled`     | 是否启用分页             | `boolean`             | `true`                              |
| `currentPage` | 初始页码                 | `number`              | `1`                                 |
| `pageSize`    | 初始每页条数             | `number`              | `10`                                |
| `pageSizes`   | 每页条数选项             | `number[]`            | `[10, 20, 50, 100]`                 |
| `layout`      | 分页布局                 | `string`              | `'total, sizes, prev, pager, next'` |
| `background`  | 是否显示背景色           | `boolean`             | `true`                              |
| `...rest`     | 其余 `ElPagination` 参数 | `Record<string, any>` | -                                   |

### Events

| 事件名           | 说明           | 回调参数                                            |
| ---------------- | -------------- | --------------------------------------------------- |
| `requestSuccess` | 查询成功后触发 | `{ values, pagination, dataSource, total, result }` |
| `requestFailed`  | 查询失败后触发 | `error`                                             |

### request 返回值约定

| 返回格式                                                             | 说明                   |
| -------------------------------------------------------------------- | ---------------------- |
| `any[]`                                                              | 直接作为 `dataSource`  |
| `{ dataSource?: any[]; data?: any[]; list?: any[]; total?: number }` | 对象格式，支持附带总数 |

对象格式下，数据源解析优先级为：`dataSource > list > data`。
