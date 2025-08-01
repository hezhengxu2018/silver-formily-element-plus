import { createForm } from '@formily/core'
import { Field, FormProvider } from '@formily/vue'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Checkbox from '../index'

describe('checkbox', () => {
  describe('单选框基础功能', () => {
    it('应该正确返显数据及正常交互', async () => {
      const form = createForm({
        initialValues: {
          checkbox: true,
        },
      })
      const { getByRole } = render(() => (
        <FormProvider form={form}>
          <Field
            name="checkbox"
            component={[
              Checkbox,
            ]}
          />
        </FormProvider>
      ))
      await expect.element(getByRole('checkbox')).toBeChecked()
      await getByRole('checkbox').click()
      await expect.element(getByRole('checkbox')).not.toBeChecked()
      expect(form.values.checkbox).toBe(false)
    })

    it('应该可以正确显示在控件上，当表单值的改变时', async () => {
      const form = createForm()
      const { getByRole } = render(() => (
        <FormProvider form={form}>
          <Field
            name="checkbox"
            disabled={true}
            initialValue={true}
            component={[
              Checkbox,
            ]}
          />
        </FormProvider>
      ))
      await expect.element(getByRole('checkbox')).toBeDisabled()
      await expect.element(getByRole('checkbox')).toBeChecked()
      form.setFieldState('checkbox', field => field.disabled = false)
      await getByRole('checkbox').click()
      await expect.element(getByRole('checkbox')).not.toBeChecked()
    })

    it('应该支持自定义标签内容', async () => {
      const form = createForm()
      const { getByText } = render(() => (
        <FormProvider form={form}>
          <Field
            name="checkbox"
            component={[
              Checkbox,
              {
                label: '自定义标签',
              },
            ]}
          />
        </FormProvider>
      ))

      expect(getByText('自定义标签')).toBeTruthy()
    })
  })
})
