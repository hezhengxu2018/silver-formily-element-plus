# FormDrawer

> 抽屉表单，主要用在简单的事件打开表单场景

::: warning 注意
该组件经过重构，完全摒弃了通过id传递上下文的方式，使用时请注意函数入参的改动。现在通过Vue中[JSX的插槽写法](https://cn.vuejs.org/guide/extras/render-function.html#passing-slots)实现类似的功能。
:::

::: tip 提示
使用函数式组件时可以通过解构的方式快速拿到`form`,具体请参考template案例。
:::

## Markup Schema 案例

:::demo

form-drawer/markup-schema

:::

## JSON Schema 案例

:::demo

form-drawer/json-schema

:::

## Template 案例

:::demo

form-drawer/template

:::

## Template 插槽案例

:::demo

form-drawer/template-slot

:::

## API

### FormDrawer 函数入参

| 参数                       | 说明                                                | 类型                                                   |
| -------------------------- | --------------------------------------------------- | ----------------------------------------------------   |
| `title`或`formDrawerProps` | 标题或Drawer组件的props                             | `string` `FormDrawerProps`                             |
| `formDrawerSlots`          | 表单抽屉组件的内容，支持组件，VNode和插槽的写法     | `Component` `VNode[]` `()=>VNode[]` `FormDrawerSlots`  |
| `dynamicMiddlewareNames`   | 动态中间件名称列表，使用时会转成Camel Case命名风格。| `string[]`除了`cancel` `confirm` `open`                |

::: warning 注意
`formDrawerProps`是有保留值的。传入`modelValue`、`onUpdate:modelValue`不会生效，已被FormDialog组件内部使用。
:::

完整函数类型声明（参数的具体类型参见类型声明）：
``` ts
interface FormDrawer {
  (
    title: IFormDrawerProps | string,
    content?: Component | FormDrawerSlotContent,
    dynamicMiddlewareNames?: string[]
  ): IFormDrawer
}
```

#### title
函数的第一个参数，传入字符串时会作为标题显示。可以传入 IFormDrawerProps 来进行自定义。请优先使用 forOpen 、 forConfirm 、 forCancel 等中间件来控制抽屉的生命周期。

| 参数                  | 说明                                                                             | 类型                | 默认值    |
| --------------------- | -------------------------------------------------------------------------------- | ------------------- | --------- |
| `cancelText`          | 取消按钮文字                                                                     | `string`            | `取消`    |
| `cancelButtonProps`   | 取消按钮的props                                                                  | `ButtonProps`       | -         |
| `okText`              | 确定按钮文字                                                                     | `string`            | `确定`    |
| `okButtonProps`       | 确定按钮的props                                                                  | `ButtonProps`       | -         |
| `loadingText`         | 加载中文字                                                                       | `string`            | `loading` |

其余参数请参考参考 [https://cn.element-plus.org/zh-CN/component/drawer.html](https://cn.element-plus.org/zh-CN/component/drawer.html#attributes)

#### content
函数的第二个参数，除了可以传入组件和VNode之外还可以接受Vue中[JSX的插槽写法](https://cn.vuejs.org/guide/extras/render-function.html#passing-slots)自定义 header 与 footer 。

| 插槽名    | 说明                                                                                                          | 类型                   |
| --------- | ------------------------------------------------------------------------------------------------------------- | ----                   |
| `default` | 表单弹窗组件的内容，支持组件，VNode和插槽的写法                                                               | -                      |
| `header`  | 头部插槽，可以通过作用域插槽调用resolve或reject来关闭，resovle可以接受`dynamicMiddlewareNames`中传入的字符串  | `FormDrawerSlotProps`  |
| `footer`  | 底部插槽，可以通过作用域插槽调用resolve或reject来关闭，resovle可以接受`dynamicMiddlewareNames`中传入的字符串  | `FormDrawerSlotProps`  |

#### dynamicMiddlewareNames
函数的第三个参数，是一个字符串数组，用于触发自定义footer或header中的按钮事件。

比如需要在抽屉中额外添加保存草稿的功能，那么就可以在 dynamicMiddlewareNames 中传入 `'saveDraft'` ，然后在 footer 中的按钮上绑定事件 `resolve('saveDraft')` 。
最后在可以像 `forConfirm` 一样添加 `forSaveDraft` 的相关逻辑。具体使用可以参考Demo中的例子。

::: tip 提示
传入`dynamicMiddlewareNames`中的字符串会被转成Camel Case命名风格，比如`'save-draft'`会被转成`'saveDraft'`。
:::

### IFormDrawer 函数返回
函数的返回值，是一个是一个Promise对象，因此可以进行await操作来优化逻辑书写，需要调用`open`方法来打开抽屉。可以进行链式调用来处理不同逻辑下的事件处理。现在支持通过`dynamicMiddlewareNames`来传入自定义的事件来处理业务逻辑。

| 方法名          | 说明         | 类型                                        |
| --------------- | ------------ | ------------------------------------------- |
| `open`          | 打开抽屉     | `(IFormProps)=>Primise<IFormProps.values>`  |
| `forOpen`       | 打开抽屉事件 | `(IMiddleware<IFormProps>)=>IFormDrawer`    |
| `forConfirm`    | 确认事件     | `(IMiddleware<IFormProps>)=>IFormDrawer`    |
| `forCancel`     | 取消事件     | `(IMiddleware<IFormProps>)=>IFormDrawer`    |
| `for${Dynamic}` | 自定义事件   | `(IMiddleware<IFormProps>)=>IFormDrawer`    |

::: tip 提示
自定义事件中的`Dynamic`的值为`dynamicMiddlewareNames`中传入的字符串，通过作用域插槽中的resolve方法来触发对应的事件。 传入`dynamicMiddlewareNames`中的字符串在调用方法时会被转成Pascal Case命名风格，比如传入`['save-draft']`应该调用`'forSaveDraft'`。
:::

::: tip 提示
现在所有通过非`resolve`调用关闭的弹框都会作为错误抛出，因此在async/await写法中如果await了FormDrawer则此之后的逻辑都只在表单成功提交后才会执行。
:::

### 类型声明

#### IFormDrawerProps
<<< @/../src/form-drawer/types.ts#props

#### FormDrawerSlots
<<< @/../src/form-drawer/types.ts#slots

#### IFormDrawer
<<< @/../src/form-drawer/types.ts#iformdrawer
