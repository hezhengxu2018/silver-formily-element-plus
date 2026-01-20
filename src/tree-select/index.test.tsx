import { createForm } from '@formily/core'
import { Field, FormProvider } from '@silver-formily/vue'
import { userEvent } from '@vitest/browser/context'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { defineComponent } from 'vue'
import TreeSelect from './index'
import 'element-plus/theme-chalk/index.css'

const sourceData = [
  {
    value: '1',
    label: 'Level one 1',
    children: [
      {
        value: '1-1',
        label: 'Level two 1-1',
      },
    ],
  },
  {
    value: '2',
    label: 'Level one 2',
    children: [
      {
        value: '2-1',
        label: 'Level two 2-1',
        children: [
          {
            value: '2-1-1',
            label: 'Level three 2-1-1',
          },
        ],
      },
      {
        value: '2-2',
        label: 'Level two 2-2',
        children: [
          {
            value: '2-2-1',
            label: 'Level three 2-2-1',
          },
        ],
      },
    ],
  },
  {
    value: '3',
    label: 'Level one 3',
    children: [
      {
        value: '3-1',
        label: 'Level two 3-1',
        children: [
          {
            value: '3-1-1',
            label: 'Level three 3-1-1',
          },
        ],
      },
      {
        value: '3-2',
        label: 'Level two 3-2',
        children: [
          {
            value: '3-2-1',
            label: 'Level three 3-2-1',
          },
        ],
      },
    ],
  },
]

function formilyWrapperFactory(fieldProps = {}, treeSelectProps = {}) {
  return defineComponent({
    props: {
      form: {
        type: Object,
        default: () => createForm(),
      },
    },
    setup(props) {
      return () => (
        <FormProvider form={props.form}>
          <Field
            name="treeSelect"
            title="treeSelect"
            dataSource={sourceData}
            {...fieldProps}
            component={[
              TreeSelect,
              {
                ...treeSelectProps,
                teleported: false,
              },
            ]}
          />
        </FormProvider>
      )
    },
  })
}

describe('TreeSelect', () => {
  describe('基础功能', () => {
    it('正常渲染', async () => {
      const form = createForm()
      const screen = render(formilyWrapperFactory({}, {}), { props: { form } })

      const treeSelect = screen.container.querySelector('.el-select')
      expect(treeSelect).toBeInTheDocument()
    })

    it('显示dataSource内的值', async () => {
      const form = createForm()
      const screen = render(formilyWrapperFactory({}, {}), { props: { form } })

      await userEvent.click(document.querySelector('.el-select'))
      await expect.element(screen.getByText('Level one 1')).toBeInTheDocument()
      await expect.element(screen.getByText('Level one 2')).toBeInTheDocument()
      await expect.element(screen.getByText('Level one 3')).toBeInTheDocument()
    })

    it('支持初始值设置', async () => {
      const form = createForm({
        initialValues: {
          treeSelect: '1-1',
        },
      })
      const screen = render(formilyWrapperFactory({}, {}), { props: { form } })
      await expect.element(screen.getByText('Level two 1-1').first()).toBeInTheDocument()
      expect(form.values.treeSelect).toBe('1-1')
    })
  })

  describe('交互功能', () => {
    it('单选模式下选择节点更新表单值', async () => {
      const form = createForm()
      const screen = render(formilyWrapperFactory({}, {}), { props: { form } })

      await userEvent.click(document.querySelector('.el-select'))
      await screen.getByText('Level one 1').click()
      await expect.element(screen.getByText('Level two 1-1')).toBeInTheDocument()
      await screen.getByText('Level two 1-1').click()
      expect(form.values.treeSelect).toBe('1-1')
    })

    it('获取TreeSelect实例引用', async () => {
      const form = createForm()
      render(formilyWrapperFactory({}, {}), { props: { form } })

      const field = form.query('treeSelect').take()
      const treeSelectRef = field.invoke('getTreeSelectRef')

      expect(treeSelectRef).toBeDefined()
    })
  })

  describe('插槽继承功能', () => {
    it('自定义节点内容插槽正常传递', async () => {
      const form = createForm()
      const TestComponent = defineComponent({
        setup() {
          return () => (
            <FormProvider form={form}>
              <Field
                name="treeSelect"
                title="treeSelect"
                dataSource={sourceData}
                component={[
                  TreeSelect,
                  {
                    teleported: false,
                  },
                ]}
              >
                {{
                  default: ({ _, data }) => (
                    <span class="custom-tree-node">
                      <span class="custom-label">
                        自定义:
                        {data.label}
                      </span>
                      <span class="custom-value">
                        值:
                        {data.value}
                      </span>
                    </span>
                  ),
                }}
              </Field>
            </FormProvider>
          )
        },
      })

      const { container } = render(TestComponent)

      // 点击展开下拉框
      await userEvent.click(container.querySelector('.el-select'))
      await expect.element(container.querySelector('.custom-tree-node')).toBeInTheDocument()
      await expect.element(container.querySelector('.custom-label')).toBeInTheDocument()
      await expect.element(container.querySelector('.custom-value')).toBeInTheDocument()
    })

    it('空状态插槽正常传递', async () => {
      const form = createForm()
      const TestComponent = defineComponent({
        setup() {
          return () => (
            <FormProvider form={form}>
              <Field
                name="treeSelect"
                title="treeSelect"
                dataSource={[]}
                component={[
                  TreeSelect,
                  {
                    teleported: false,
                  },
                ]}
              >
                {{
                  empty: () => (
                    <div class="custom-empty">
                      <span class="empty-icon">📁</span>
                      <span class="empty-text">自定义空状态提示</span>
                    </div>
                  ),
                }}
              </Field>
            </FormProvider>
          )
        },
      })

      const { container } = render(TestComponent)

      // 点击展开下拉框
      await userEvent.click(container.querySelector('.el-select'))

      // 验证自定义空状态插槽被正确渲染
      await expect.element(container.querySelector('.custom-empty')).toBeInTheDocument()
      await expect.element(container.querySelector('.empty-icon')).toBeInTheDocument()
      await expect.element(container.querySelector('.empty-text')).toBeInTheDocument()
    })

    it('前缀插槽正常传递', async () => {
      const form = createForm()
      const TestComponent = defineComponent({
        setup() {
          return () => (
            <FormProvider form={form}>
              <Field
                name="treeSelect"
                title="treeSelect"
                dataSource={sourceData}
                component={[
                  TreeSelect,
                  {
                    teleported: false,
                  },
                ]}
              >
                {{
                  prefix: () => (
                    <span class="custom-prefix">🌳</span>
                  ),
                }}
              </Field>
            </FormProvider>
          )
        },
      })

      const { container } = render(TestComponent)

      // 验证前缀插槽被正确渲染
      await expect.element(container.querySelector('.custom-prefix')).toBeInTheDocument()
      expect(container.textContent).toContain('🌳')
    })

    it('动态插槽名称正确传递', async () => {
      const customSlotName = 'customSlot'
      const form = createForm()
      const TestComponent = defineComponent({
        setup() {
          return () => (
            <FormProvider form={form}>
              <Field
                name="treeSelect"
                title="treeSelect"
                dataSource={sourceData}
                component={[
                  TreeSelect,
                  {
                    teleported: false,
                  },
                ]}
              >
                {{
                  [customSlotName]: ({ data }: { data: any }) => (
                    <span class="dynamic-slot-content">
                      动态插槽:
                      {' '}
                      {data.label}
                    </span>
                  ),
                  default: ({ data }: { data: any }) => (
                    <span class="default-slot-content">
                      {data.label}
                    </span>
                  ),
                }}
              </Field>
            </FormProvider>
          )
        },
      })

      const { container } = render(TestComponent)
      await userEvent.click(container.querySelector('.el-select'))
      await expect.element(container.querySelector('.default-slot-content')).toBeInTheDocument()
      expect(container.textContent).toContain('Level one 1')
    })
  })
})
