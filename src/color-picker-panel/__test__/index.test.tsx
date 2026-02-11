import { createForm } from '@formily/core'
import { Field, FormProvider } from '@silver-formily/vue'
import { userEvent } from '@vitest/browser/context'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import ColorPickerPanel from '../index'
import 'element-plus/theme-chalk/index.css'

describe('ColorPickerPanel', () => {
  it('应该正常渲染面板', async () => {
    render(() => (
      <FormProvider form={createForm()}>
        <Field name="color" component={[ColorPickerPanel]} />
      </FormProvider>
    ))

    const panel = document.querySelector('.el-color-picker-panel')
    expect(panel).toBeInTheDocument()
  })

  it('应该在选择预设颜色后更新表单值', async () => {
    const form = createForm()
    render(() => (
      <FormProvider form={form}>
        <Field
          name="color"
          component={[
            ColorPickerPanel,
            {
              predefine: ['#409eff', '#67c23a'],
            },
          ]}
        />
      </FormProvider>
    ))

    const predefine = document.querySelectorAll<HTMLButtonElement>(
      '.el-color-predefine__color-selector',
    )

    expect(predefine.length).toBeGreaterThan(0)

    await userEvent.click(predefine[0])

    expect(form.values.color).toBe('#409eff')
  })
})
