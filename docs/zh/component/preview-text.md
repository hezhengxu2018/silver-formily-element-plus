# PreviewText

> 阅读态组件，主要用来实现类 Input，类 DatePicker 这些组件的阅读态

::: warning 注意
1. 组件经过了重构，删除了`PreviewText.Placeholder`,`PreviewText.usePlaceholder`。
2. `PreviewText` 组件现在是提供配置项的无渲染组件，不再提供预览的功能。
3. 占位符现在不支持VNode。
:::

## 简单案例

:::demo

preview-text/base

:::

## 扩展案例

:::demo

preview-text/extend

:::

## 自定义配置

:::demo

preview-text/preview-config

:::

## API

### PreviewText.Input

参考 [https://cn.element-plus.org/zh-CN/component/input.html](https://cn.element-plus.org/zh-CN/component/input.html)

### PreviewText.Select

参考 [https://cn.element-plus.org/zh-CN/component/select.html](https://cn.element-plus.org/zh-CN/component/select.html)

### PreviewText.Cascader

参考 [https://cn.element-plus.org/zh-CN/component/cascader.html](https://cn.element-plus.org/zh-CN/component/cascader.html)

### PreviewText.DatePicker

参考 [https://cn.element-plus.org/zh-CN/component/date-picker.html](https://cn.element-plus.org/zh-CN/component/date-picker.html)

### PreviewText.TimePicker

参考 [https://cn.element-plus.org/zh-CN/component/time-picker.html](https://cn.element-plus.org/zh-CN/component/time-picker.html)

### PreviewText

| 属性名      | 类型                  | 描述                  | 默认值                                      |
| ------      | ------                | ----------            | ------                                      |
| placeholder | `string`              | 缺省占位符            | N/A                                         |
| tagProps    | ^[object]`TagProps`   | ElTag 组件的属性配置  | ^[object]`{ type: 'info', effect: 'light' }`|
| spaceProps  | ^[object]`SpaceProps` | ElSpace 组件的属性配置| -                                           |
| textProps   | ^[object]`TextProps`  | ElText 组件的属性配置 | -                                           |
