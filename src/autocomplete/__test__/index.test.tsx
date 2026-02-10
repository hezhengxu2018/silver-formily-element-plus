import type { Field as FormilyField } from '@formily/core'
import { createForm } from '@formily/core'
import { Field, FormProvider } from '@silver-formily/vue'
import { userEvent } from '@vitest/browser/context'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { nextTick } from 'vue'
import Autocomplete from '../index'
import 'element-plus/theme-chalk/index.css'

const options = [
  { value: 'Apple' },
  { value: 'Banana' },
  { value: 'Cherry' },
]

const SUGGESTION_SELECTOR = '.el-autocomplete-suggestion__list li'
type OptionList = typeof options

async function waitForSuggestionItems(expectedLength?: number) {
  await vi.waitFor(() => {
    const items = document.querySelectorAll(SUGGESTION_SELECTOR)
    if (expectedLength === undefined) {
      expect(items.length).toBeGreaterThan(0)
    }
    else {
      expect(items).toHaveLength(expectedLength)
    }
  })
  return document.querySelectorAll(SUGGESTION_SELECTOR)
}

function createDeferredFetch(data: OptionList = options) {
  let flushFetch: (() => void) | undefined
  const fetchSuggestions = vi.fn((
    query: string,
    cb: (items: OptionList) => void,
    field?: FormilyField,
  ) => new Promise<OptionList>((resolve) => {
    if (field) {
      field.loading = true
    }

    flushFetch = () => {
      if (field) {
        field.loading = false
      }
      cb(data)
      resolve(data)
    }
  }))

  return {
    fetchSuggestions,
    async flush() {
      flushFetch?.()
      await nextTick()
    },
  }
}

describe('Autocomplete', () => {
  describe('基础功能', () => {
    it('应该正常渲染并展示数据源', async () => {
      const page = render(() => (
        <FormProvider form={createForm()}>
          <Field
            name="autocomplete"
            component={[Autocomplete, { triggerOnFocus: true, placeholder: '请输入内容' }]}
            dataSource={options}
          />
        </FormProvider>
      ))

      const input = page.getByPlaceholder('请输入内容')
      await expect.element(input).toBeInTheDocument()
      await userEvent.click(input)

      await waitForSuggestionItems(3)
    })

    it('应该在选择建议后更新表单值', async () => {
      const form = createForm()
      render(() => (
        <FormProvider form={form}>
          <Field
            name="autocomplete"
            component={[Autocomplete, { triggerOnFocus: true }]}
            dataSource={options}
          />
        </FormProvider>
      ))

      const input = document.querySelector('input')
      await userEvent.click(input)
      const items = await waitForSuggestionItems(3)
      await userEvent.click(items[1])

      expect(form.values.autocomplete).toBe('Banana')
    })

    it('应该根据输入结果过滤建议', async () => {
      render(() => (
        <FormProvider form={createForm()}>
          <Field name="autocomplete" component={[Autocomplete]} dataSource={options} />
        </FormProvider>
      ))

      const input = document.querySelector('input')
      await userEvent.type(input, 'ap')

      const items = await waitForSuggestionItems(1)
      expect(items[0].textContent).toContain('Apple')
    })
  })

  describe('插槽与自定义', () => {
    it('应该在 default slot 中透出 field', async () => {
      render(() => (
        <FormProvider form={createForm()}>
          <Field name="autocomplete" component={[Autocomplete, { triggerOnFocus: true }]} dataSource={options} initialValue="Prefilled">
            {{
              default: ({ item, field }) => (
                <div class="custom-item">
                  {item.value}
                  -
                  {field?.initialValue}
                </div>
              ),
            }}
          </Field>
        </FormProvider>
      ))

      const input = document.querySelector('input')
      await userEvent.click(input)
      await userEvent.clear(input)

      await vi.waitFor(() => {
        const customItem = document.querySelector('.custom-item')
        expect(customItem).toBeInTheDocument()
        expect(customItem?.textContent).toContain('Prefilled')
      })
    })

    it('应该优先使用外部传入的 fetchSuggestions', async () => {
      const fetchSuggestions = vi.fn((query: string, cb: (data: Array<{ value: string }>) => void, fieldArg?: any) => {
        cb(query ? [{ value: `${query}-result` }] : [{ value: 'default-result' }])
        return fieldArg
      })

      render(() => (
        <FormProvider form={createForm()}>
          <Field
            name="autocomplete"
            component={[Autocomplete, { fetchSuggestions, triggerOnFocus: true }]}
            dataSource={[]}
          />
        </FormProvider>
      ))

      const input = document.querySelector('input')
      await userEvent.click(input)
      await userEvent.type(input, 'custom')

      await vi.waitFor(() => {
        expect(fetchSuggestions).toHaveBeenCalled()
      })
      const fieldArg = fetchSuggestions.mock.calls[0][2]
      expect(fieldArg?.path?.toString()).toBe('autocomplete')
      const items = await waitForSuggestionItems()
      expect(items[0].textContent).toContain('custom-result')
    })

    it('应该支持 header 与 footer 插槽', async () => {
      render(() => (
        <FormProvider form={createForm()}>
          <Field
            name="autocomplete"
            component={[Autocomplete, { triggerOnFocus: true }]}
            dataSource={options}
            initialValue="Apple"
          >
            {{
              header: ({ field }) => (
                <div class="custom-header">
                  最近选择：
                  {field?.value?.value}
                </div>
              ),
              footer: () => <div class="custom-footer">自定义底部</div>,
            }}
          </Field>
        </FormProvider>
      ))

      const input = document.querySelector('input')
      await userEvent.click(input)
      await vi.waitFor(() => {
        expect(document.querySelector('.custom-header')).toBeInTheDocument()
        expect(document.querySelector('.custom-footer')).toBeInTheDocument()
      })
    })

    it('应该支持 loading 插槽', async () => {
      const { fetchSuggestions, flush } = createDeferredFetch()
      render(() => (
        <FormProvider form={createForm()}>
          <Field
            name="slot-loading"
            component={[Autocomplete, { triggerOnFocus: true, fetchSuggestions }]}
            dataSource={[]}
          >
            {{
              loading: () => <div class="custom-loading">加载中...</div>,
            }}
          </Field>
        </FormProvider>
      ))

      const input = document.querySelector('input')
      await userEvent.type(input, 'c')
      await vi.waitFor(() => {
        expect(fetchSuggestions).toHaveBeenCalled()
        expect(document.querySelector('.custom-loading')).toBeInTheDocument()
      })

      await flush()
      await waitForSuggestionItems(options.length)
    })

    it('应该在远程搜索时同步 field 的 loading 状态', async () => {
      const form = createForm()
      const { fetchSuggestions, flush } = createDeferredFetch()
      render(() => (
        <FormProvider form={form}>
          <Field
            name="auto-loading"
            component={[Autocomplete, { triggerOnFocus: true, fetchSuggestions }]}
            dataSource={[]}
          >
            {{
              loading: () => <div class="field-loading">field loading</div>,
            }}
          </Field>
        </FormProvider>
      ))

      await nextTick()
      const field = form.query('auto-loading').take()

      const input = document.querySelector('input')
      await userEvent.type(input, 'c')

      await vi.waitFor(() => {
        expect((field as FormilyField)?.loading).toBe(true)
        expect(document.querySelector('.field-loading')).toBeInTheDocument()
      })

      await flush()
      await vi.waitFor(() => {
        expect((field as FormilyField)?.loading).toBe(false)
      })
    })
    it('应该支持获取ElAutocomplete实例', async () => {
      const form = createForm()
      render(() => (
        <FormProvider form={form}>
          <Field name="auto-ref" component={[Autocomplete]} dataSource={options} />
        </FormProvider>
      ))

      await nextTick()
      const field = form.query('auto-ref').take()
      const autoRef = field?.invoke('getElAutocompleteRef')
      expect(autoRef?.value).toBeTruthy()
    })
  })
})
