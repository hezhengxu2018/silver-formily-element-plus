# QueryForm

> 查询表单组件，基于 FormGrid + Submit/Reset 实现折叠展开

::: tip 提示

- 默认 `layout="vertical"`、`feedbackLayout="terse"`，可以通过传入 Form 的属性覆盖。
- 传入默认插槽时会优先使用插槽渲染，`schema` 将被忽略。
- 如需复用已经创建的 `SchemaField`，可通过 `schemaField` 传入。
- 默认折叠策略按首行收起，可通过 `visibleWhen` 自定义显示逻辑。
  :::

## Markup Schema 案例

:::demo

query-form/markup-schema

:::

## JSON Schema 案例

:::demo

query-form/json-schema

:::

## 操作区行尾对齐示例（操作按钮始终在尾部可减少展开收起时的定位闪动）

:::demo

query-form/actions-at-row-end

:::

## visibleWhen 示例（按字段名）

:::demo

query-form/visible-when

:::

## visibleWhen 示例（默认折叠显示前两行）

:::demo

query-form/visible-when-two-rows

:::

## visibleWhen 示例（默认折叠显示前 N 项）

:::demo

query-form/visible-when-top-n

:::

## API

### QueryForm Props

| 属性名          | 说明                                               | 类型                                               | 默认值  |
| --------------- | -------------------------------------------------- | -------------------------------------------------- | ------- |
| form            | 传入表单实例                                       | `Form`                                             | -       |
| schema          | JSON Schema 渲染                                   | `ISchema`                                          | -       |
| schemaField     | 自定义 SchemaField                                 | `Component`                                        | -       |
| components      | JSON Schema 组件映射                               | `Record<string, Component>`                        | `{}`    |
| scope           | JSON Schema 作用域                                 | `Record<string, any>`                              | `{}`    |
| gridProps       | 创建 Grid 的参数（不包含 shouldVisible / maxRows） | `Omit<IGridOptions, 'shouldVisible' \| 'maxRows'>` | `{}`    |
| defaultExpanded | 初始是否展开                                       | `boolean`                                          | `false` |
| actionsAtRowEnd | 操作区是否固定在行尾右侧显示                       | `boolean`                                          | `false` |
| visibleWhen     | 字段可见性判断函数                                 | `(context) => boolean`                             | -       |
| submitText      | 提交按钮文字                                       | `string`                                           | `查询`  |
| resetText       | 重置按钮文字                                       | `string`                                           | `重置`  |
| expandText      | 展开按钮文字                                       | `string`                                           | `展开`  |
| collapseText    | 收起按钮文字                                       | `string`                                           | `收起`  |
| showSubmit      | 是否显示提交按钮                                   | `boolean`                                          | `true`  |
| showReset       | 是否显示重置按钮                                   | `boolean`                                          | `true`  |
| submitProps     | 透传给 Submit 的属性                               | `Record<string, any>`                              | -       |
| resetProps      | 透传给 Reset 的属性                                | `Record<string, any>`                              | -       |

### Slots

| 插槽名   | 说明                           | Slot Props                   |
| -------- | ------------------------------ | ---------------------------- |
| default  | 表单内容（Markup Schema 场景） | -                            |
| actions  | 自定义操作按钮区域             | `{ expanded, toggle, type }` |
| collapse | 自定义展开/收起按钮            | `{ expanded, toggle, type }` |

::: tip 提示
`type` 的可选值：`'incomplete-wrap' | 'collapsible' | 'complete-wrap'`。
:::

### visibleWhen Context

#### QueryFormVisibleContext

<<< @/../src/query-form/types.ts#visible

### Types

#### IQueryFormProps

<<< @/../src/query-form/types.ts#props
