# QueryFormItem

> 基于 `QueryForm` 的装饰器组件，用于按条件请求并更新当前字段的 `dataSource`。

::: tip 提示

- `querySchema` 用于配置查询区 Schema。
- `queryFormProps` 用于透传 `QueryForm` / `QueryForm.Light` 的配置项。
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

| 属性名            | 说明                                                             | 类型                                                    | 默认值                                                                                                                 |
| ----------------- | ---------------------------------------------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `mode`            | 查询模式                                                         | `'default' \| 'light'`                                  | `'default'`                                                                                                            |
| `request`         | 查询函数；分页开启时会在第一个参数中注入 `current` 与 `pageSize` | `(params) => Promise<QueryFormItemRequestResultObject>` | -                                                                                                                      |
| `querySchema`     | 查询区 Schema                                                    | `ISchema`                                               | -                                                                                                                      |
| `queryFormProps`  | 查询表单配置                                                     | `QueryFormItemQueryProps`                               | `{}`                                                                                                                   |
| `pagination`      | 是否启用分页                                                     | `boolean`                                               | `true`                                                                                                                 |
| `paginationProps` | 分页配置，透传给 `ElPagination`                                  | `QueryFormItemPaginationProps`                          | `{ currentPage: 1, pageSize: 10, pageSizes: [10, 20, 50, 100], layout: 'total, prev, pager, next', background: true }` |
| `paginationMap`   | 分页参数映射（用于请求入参键名）                                 | `QueryFormItemPaginationMap`                            | `{ current: 'current', pageSize: 'pageSize' }`                                                                         |
| `immediate`       | 挂载后是否立即执行一次查询                                       | `boolean`                                               | `true`                                                                                                                 |

### queryFormProps

按 `mode` 透传 `queryFormProps` 到：

- `mode='default'` 透传到 `QueryForm`
- `mode='light'` 透传到 `QueryForm.Light`

具体入参参考 QueryForm 组件

::: warning 注意
`QueryFormItem` 内部使用 `onAutoSubmit` 触发查询，请不要在 `queryFormProps` 中覆盖 `onAutoSubmit`。
:::

### paginationProps

参考 Element-Plus 的 Pagination 组件

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
