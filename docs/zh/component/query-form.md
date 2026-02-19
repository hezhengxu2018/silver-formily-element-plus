# QueryForm

> 查询表单组件，基于 FormGrid + Submit/Reset 实现折叠展开

::: tip 提示

- 默认 `layout="vertical"`、`feedbackLayout="terse"`，可以通过传入 Form 的属性覆盖。
- 传入默认插槽时会优先使用插槽渲染，`schema` 将被忽略。
- 如需复用已经创建的 `SchemaField`，可通过 `schemaField` 传入。
  :::

## Markup Schema 案例

:::demo

query-form/markup-schema

:::

## JSON Schema 案例

:::demo

query-form/json-schema

:::

## API

### QueryForm Props

| 属性名          | 说明                 | 类型                        | 默认值  |
| --------------- | -------------------- | --------------------------- | ------- |
| form            | 传入表单实例         | `Form`                      | -       |
| schema          | JSON Schema 渲染     | `ISchema`                   | -       |
| schemaField     | 自定义 SchemaField   | `Component`                 | -       |
| components      | JSON Schema 组件映射 | `Record<string, Component>` | `{}`    |
| scope           | JSON Schema 作用域   | `Record<string, any>`       | `{}`    |
| grid            | 传入 Grid 实例       | `Grid`                      | -       |
| gridProps       | 创建 Grid 的参数     | `Partial<IGridOptions>`     | `{}`    |
| maxRows         | 折叠时最多显示行数   | `number`                    | `1`     |
| defaultExpanded | 初始是否展开         | `boolean`                   | `false` |
| shouldVisible   | 自定义可见性逻辑     | `(node, grid) => boolean`   | -       |
| submitText      | 提交按钮文字         | `string`                    | `查询`  |
| resetText       | 重置按钮文字         | `string`                    | `重置`  |
| expandText      | 展开按钮文字         | `string`                    | `展开`  |
| collapseText    | 收起按钮文字         | `string`                    | `收起`  |
| showSubmit      | 是否显示提交按钮     | `boolean`                   | `true`  |
| showReset       | 是否显示重置按钮     | `boolean`                   | `true`  |
| submitProps     | 透传给 Submit 的属性 | `Record<string, any>`       | -       |
| resetProps      | 透传给 Reset 的属性  | `Record<string, any>`       | -       |

### Slots

| 插槽名   | 说明                           | Slot Props                   |
| -------- | ------------------------------ | ---------------------------- |
| default  | 表单内容（Markup Schema 场景） | -                            |
| actions  | 自定义操作按钮区域             | `{ expanded, toggle, type }` |
| collapse | 自定义展开/收起按钮            | `{ expanded, toggle, type }` |

::: tip 提示
`type` 的可选值：`'incomplete-wrap' | 'collapsible' | 'complete-wrap'`。
:::

### Types

#### IQueryFormProps

<<< @/../src/query-form/types.ts#props
