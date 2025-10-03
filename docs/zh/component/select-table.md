# Select Table

> 表格选择组件

::: warning 注意
`rowKey`为必填项，不同于 Element-Plus, 现在仅支持字符串**不支持函数**。目前不支持树形选择。
:::

::: tip 提示
当 `mode` 为 `single` 时，`value` 为单个值；当 `mode` 为 `multiple` 时，`value` 为数组。
:::

## MarkupSchema 多选示例

:::demo

select-table/markup-schema-multiple

:::

## MarkupSchema 多选示例

> 多选配合插槽使用

:::demo

select-table/markup-schema-multiple-slot

:::

## JSONSchema 多选示例

:::demo

select-table/json-schema-multiple

:::

## JSONSchema 单选示例

> 单选，返回整行数据，隐藏提示工具条

:::demo

select-table/json-schema-single

:::

## Template 单选示例

> 单选，仅返回选中的key

:::demo

select-table/template-single

:::

## Template 多选示例

> 多选，返回整行数据，使用插槽

:::demo

select-table/template-multiple-slot

:::

## API

### SelectTable Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| mode | 选择模式 | ^[enum]`'multiple' \| 'single'` | `multiple` |
| columns | 表格列配置，配置参数可以参考[官方文档](https://cn.element-plus.org/zh-CN/component/table.html#table-column-%E5%B1%9E%E6%80%A7) | ^[array]`数组格式参考说明中的官方文档地址` | `[]` |
| optionAsValue | 是否将整行数据作为选择值 | ^[boolean] | `false` |
| rowKey | 必填，行数据的唯一标识字段，element-plus中的属性值 | ^[string] | — |
| clickRowToSelect | 是否点击整行进行选择，如果需要对表格内局部添加点击事件需要禁用该配置项 | ^[boolean] | `true` |
| showAlertToolbar | 是否显示选择提示工具栏 | ^[boolean] | `true` |

::: tip 提示
`onSelect`、`onSelectAll`、`onRowClick`事件已被组件内部使用，请勿使用。其余属性与事件请参考[官方文档](https://cn.element-plus.org/zh-CN/component/table.html#table-%E5%B1%9E%E6%80%A7)，例如可以限制表格高度或者条纹等，但会有不推荐的配置项，例如应该用Formily的dataSource配置项来渲染表格数据而不是ElTable的data属性。
:::

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 自定义列的内容，一般情况下会搭配`ElTableCoulum`组件使用，具体参数请参考[官方文档](https://cn.element-plus.org/zh-CN/component/table.html#table-column-api) |
