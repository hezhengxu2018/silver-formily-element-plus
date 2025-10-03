# FormGrid

> FormGrid 组件

::: tip 提示
该组件移除了`createFormGrid`，请自行从`@formily/grid`依赖中引入。
:::

## Markup Schema 案例

:::demo

form-grid/markup-schema

:::

## JSON Schema 案例

:::demo

form-grid/json-schema

:::

## 原生案例

:::demo

form-grid/native

:::

## 查询表单实现案例

:::demo

form-grid/form

:::

## API

### FormGrid

| 属性名        | 类型                   | 描述                                                           | 默认值            |
| ------------- | ---------------------- | -------------------------------------------------------------- | ----------------- |
| columnGap     | `number`               | 列间距                                                         | 8                 |
| rowGap        | `number`               | 行间距                                                         | 4                 |
| minColumns    | `number \| number[]`   | 最小列数                                                       | 0                 |
| minWidth      | `number \| number[]`   | 元素最小宽度                                                   | 100               |
| maxColumns    | `number \| number[]`   | 最大列数                                                       | -                 |
| maxWidth      | `number \| number[]`   | 元素最大宽度                                                   | -                 |
| breakpoints   | `number[]`             | 容器尺寸断点                                                   | `[720, 1280, 1920]` |
| colWrap       | `boolean`              | 自动换行                                                       | true              |
| strictAutoFit | `boolean`              | GridItem 宽度是否严格受限于 maxWidth，不受限的话会自动占满容器 | false             |
| shouldVisible | `(node, grid) => boolean` | 是否需要显示当前节点                                           | `() => true`      |
| grid          | `Grid`                 | 外部传入 Grid 实例，用于实现更复杂的布局逻辑                   | -                 |

::: tip 注意

- `minWidth` 的优先级高于 `minColumns`。
- `maxWidth` 的优先级高于 `maxColumns`。
- `minWidth`/`maxWidth`/`minColumns`/`maxColumns` 的数组格式与 `breakpoints` 数组一一映射。
:::

### FormGrid.GridColumn

| 属性名   | 类型   | 描述                                                 | 默认值 |
| -------- | ------ | ---------------------------------------------------- | ------ |
| gridSpan | number | 元素所跨列数，如果为 -1，那么会自动反向跨列填补单元格 | 1      |

---

### FormGrid.useFormGrid

从上下文中读取 Grid 实例

```ts
interface useFormGrid {
  (): Grid
}
```

- Grid 实例属性方法参考 [https://github.com/alibaba/formily/tree/formily_next/packages/grid](https://github.com/alibaba/formily/tree/formily_next/packages/grid)
