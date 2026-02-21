# QueryFormItem

> 基于 `QueryForm` 的装饰器组件，用于按条件请求并更新当前字段的 `dataSource`。

::: tip 提示

- `querySchema` 用于配置查询区 Schema。
- 除 `mode` / `request` / `querySchema` / `paginationProps` / `immediate` 外，其余参数会按 `mode` 透传给 `QueryForm` / `QueryForm.Light`。
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

- `mode`: 查询模式。类型：`'default' | 'light'`，默认值：`'default'`
- `request`: 查询函数；分页开启时会在第一个参数中注入分页参数（默认 `current` 与 `pageSize`）。类型：`(params) => Promise<QueryFormItemRequestResultObject>`
- `querySchema`: 查询区 Schema。类型：`ISchema`
- `paginationProps`: 分页配置，透传给 `ElPagination`。类型：`QueryFormItemPaginationProps`，默认值：`{ enabled: true, currentPage: 1, pageSize: 10, pageSizes: [10, 20, 50, 100], layout: 'total, sizes, prev, pager, next', background: true }`
- `paginationMap`: 分页参数映射（用于请求入参键名）。类型：`QueryFormItemPaginationMap`，默认值：`{ current: 'current', pageSize: 'pageSize' }`
- `immediate`: 挂载后是否立即执行一次查询。类型：`boolean`，默认值：`true`

### 透传 QueryForm 参数

除 `mode` / `request` / `querySchema` / `paginationProps` / `immediate` 外，其余参数会按 `mode` 透传：

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

::: warning 注意
`QueryFormItem` 内部使用 `onAutoSubmit` 触发查询，请不要透传覆盖 `onAutoSubmit`。
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

`request` 必须返回以下格式（参考 ProTable）：

```ts
interface QueryResult {
  data: any[]
  success: boolean
  total?: number
}
```

- `success` 必须为 `true` 才会解析 `data` 到字段 `dataSource`。
- `total` 不传时默认使用 `data.length`，分页场景建议显式返回。

### 分页参数映射

默认分页参数键名为 `current` 和 `pageSize`。如果后端需要其他键名，可通过 `paginationMap` 配置：

```ts
const props = {
  paginationMap: {
    current: 'pageNum',
    pageSize: 'pageSize',
  },
}
```
