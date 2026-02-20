import type { Form } from '@formily/core'
import type { QueryFormItemRequest } from '../../index'
import { createForm } from '@formily/core'
import { createSchemaField, Field, FormProvider } from '@silver-formily/vue'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { defineComponent } from 'vue'
import { QueryFormItem, SelectTable } from '../../index'
import 'element-plus/theme-chalk/index.css'

const querySchema = {
  type: 'object',
  properties: {
    keyword: {
      'type': 'string',
      'title': 'Keyword',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
  },
}

function formilyWrapperFactory(
  form: Form,
  request: (values: Record<string, any>, pagination?: { current: number, pageSize: number }) => Promise<any>,
  decoratorProps: Record<string, any> = {},
) {
  return defineComponent({
    setup() {
      return () => (
        <FormProvider form={form}>
          <Field
            name="selected"
            decorator={[QueryFormItem, { querySchema, request, ...decoratorProps }]}
            component={[
              SelectTable,
              {
                rowKey: 'id',
                mode: 'multiple',
                columns: [{ prop: 'name', label: 'Name' }],
              },
            ]}
          />
        </FormProvider>
      )
    },
  })
}

describe('QueryFormItem', () => {
  it('should request with pagination info by default and sync field dataSource', async () => {
    const form = createForm()
    const request = vi.fn<QueryFormItemRequest>(async () => ({
      dataSource: [{ id: '1', name: 'Row-1' }],
      total: 1,
    }))

    render(formilyWrapperFactory(form, request))

    await vi.waitFor(() => {
      expect(request).toHaveBeenCalled()
    })

    expect(request.mock.calls[0]?.[0]).toEqual({})
    expect(request.mock.calls[0]?.[1]).toEqual({ current: 1, pageSize: 10 })
    await vi.waitFor(() => {
      expect(document.body.textContent).toContain('Row-1')
    })
    expect(form.query('selected').get('dataSource')).toEqual([{ id: '1', name: 'Row-1' }])
  })

  it('should not pass pagination params when pagination is disabled', async () => {
    const form = createForm()
    const request = vi.fn<QueryFormItemRequest>(async () => ([{ id: '2', name: 'Row-2' }]))

    const screen = render(formilyWrapperFactory(form, request, {
      paginationProps: {
        enabled: false,
      },
    }))

    await vi.waitFor(() => {
      expect(request).toHaveBeenCalled()
    })

    expect(request.mock.calls[0]?.length).toBe(1)
    await vi.waitFor(() => {
      expect(document.body.textContent).toContain('Row-2')
    })
    expect(screen.container.querySelector('.el-pagination')).toBeNull()
  })

  it('should render query form in light mode', async () => {
    const form = createForm()
    const request = vi.fn<QueryFormItemRequest>(async () => ([{ id: '3', name: 'Row-3' }]))

    const screen = render(formilyWrapperFactory(form, request, {
      mode: 'light',
      paginationProps: { enabled: false },
      queryFormProps: { throttleWait: 0 },
    }))

    await expect.element(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('should render query form when querySchema is provided', async () => {
    const form = createForm()
    const request = vi.fn<QueryFormItemRequest>(async () => ([{ id: '4', name: 'Row-4' }]))

    const screen = render(formilyWrapperFactory(form, request, {
      mode: 'light',
      paginationProps: { enabled: false },
      querySchema,
    }))

    await expect.element(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('should request with pagination props values', async () => {
    const form = createForm()
    const request = vi.fn<QueryFormItemRequest>(async () => ([{ id: '5', name: 'Row-5' }]))

    render(formilyWrapperFactory(form, request, {
      paginationProps: {
        currentPage: 2,
        pageSize: 5,
      },
    }))

    await vi.waitFor(() => {
      expect(request).toHaveBeenCalled()
    })
    expect(request.mock.calls[0]?.[1]).toEqual({ current: 2, pageSize: 5 })
  })

  it('should hide pagination in markup schema when paginationProps.enabled is false', async () => {
    const form = createForm()
    const request = vi.fn<QueryFormItemRequest>(async () => ([{ id: '6', name: 'Row-6' }]))

    const schema = {
      type: 'object',
      properties: {
        selected: {
          'type': 'array',
          'x-decorator': 'QueryFormItem',
          'x-decorator-props': {
            mode: 'light',
            querySchema,
            request,
            paginationProps: {
              enabled: false,
            },
          },
          'x-component': 'SelectTable',
          'x-component-props': {
            rowKey: 'id',
            mode: 'multiple',
            columns: [{ prop: 'name', label: 'Name' }],
          },
        },
      },
    }

    const { SchemaField } = createSchemaField({
      components: {
        QueryFormItem,
        SelectTable,
      },
    })

    const screen = render(defineComponent({
      setup() {
        return () => (
          <FormProvider form={form}>
            <SchemaField schema={schema as any} />
          </FormProvider>
        )
      },
    }))

    await vi.waitFor(() => {
      expect(request).toHaveBeenCalled()
    })

    expect(screen.container.querySelector('.el-pagination')).toBeNull()
  })
})
