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
  request: (params: Record<string, any>) => Promise<any>,
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
      data: [{ id: '1', name: 'Row-1' }],
      success: true,
      total: 1,
    }))

    render(formilyWrapperFactory(form, request))

    await vi.waitFor(() => {
      expect(request).toHaveBeenCalled()
    })

    expect(request.mock.calls[0]?.[0]).toEqual({ current: 1, pageSize: 10 })
    await vi.waitFor(() => {
      expect(document.body.textContent).toContain('Row-1')
    })
    expect(form.query('selected').get('dataSource')).toEqual([{ id: '1', name: 'Row-1' }])
  })

  it('should not pass pagination params when pagination is disabled', async () => {
    const form = createForm()
    const request = vi.fn<QueryFormItemRequest>(async () => ({
      data: [{ id: '2', name: 'Row-2' }],
      success: true,
      total: 1,
    }))

    const screen = render(formilyWrapperFactory(form, request, {
      paginationProps: {
        enabled: false,
      },
    }))

    await vi.waitFor(() => {
      expect(request).toHaveBeenCalled()
    })

    expect(request.mock.calls[0]?.[0]).toEqual({})
    await vi.waitFor(() => {
      expect(document.body.textContent).toContain('Row-2')
    })
    expect(screen.container.querySelector('.el-pagination')).toBeNull()
  })

  it('should render query form in light mode', async () => {
    const form = createForm()
    const request = vi.fn<QueryFormItemRequest>(async () => ({
      data: [{ id: '3', name: 'Row-3' }],
      success: true,
      total: 1,
    }))

    const screen = render(formilyWrapperFactory(form, request, {
      mode: 'light',
      paginationProps: { enabled: false },
      throttleWait: 0,
    }))

    await expect.element(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('should render query form when querySchema is provided', async () => {
    const form = createForm()
    const request = vi.fn<QueryFormItemRequest>(async () => ({
      data: [{ id: '4', name: 'Row-4' }],
      success: true,
      total: 1,
    }))

    const screen = render(formilyWrapperFactory(form, request, {
      mode: 'light',
      paginationProps: { enabled: false },
      querySchema,
    }))

    await expect.element(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('should request with pagination props values', async () => {
    const form = createForm()
    const request = vi.fn<QueryFormItemRequest>(async () => ({
      data: [{ id: '5', name: 'Row-5' }],
      success: true,
      total: 1,
    }))

    render(formilyWrapperFactory(form, request, {
      paginationProps: {
        currentPage: 2,
        pageSize: 5,
      },
    }))

    await vi.waitFor(() => {
      expect(request).toHaveBeenCalled()
    })
    expect(request.mock.calls[0]?.[0]).toEqual({ current: 2, pageSize: 5 })
  })

  it('should prefer external form values for initial request', async () => {
    const form = createForm()
    const externalQueryForm = createForm({
      values: {
        keyword: 'initial-keyword',
      },
    })
    const request = vi.fn<QueryFormItemRequest>(async () => ({
      data: [{ id: '8', name: 'Row-8' }],
      success: true,
      total: 1,
    }))

    render(formilyWrapperFactory(form, request, {
      form: externalQueryForm,
    }))

    await vi.waitFor(() => {
      expect(request).toHaveBeenCalled()
    })

    expect(request.mock.calls[0]?.[0]).toEqual({
      keyword: 'initial-keyword',
      current: 1,
      pageSize: 10,
    })
  })

  it('should hide pagination in markup schema when paginationProps.enabled is false', async () => {
    const form = createForm()
    const request = vi.fn<QueryFormItemRequest>(async () => ({
      data: [{ id: '6', name: 'Row-6' }],
      success: true,
      total: 1,
    }))

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

  it('should not sync dataSource when request success is false', async () => {
    const form = createForm()
    const request = vi.fn<QueryFormItemRequest>(async () => ({
      data: [{ id: '7', name: 'Row-7' }],
      success: false,
      total: 1,
    }))

    render(formilyWrapperFactory(form, request))

    await vi.waitFor(() => {
      expect(request).toHaveBeenCalled()
    })

    expect(document.body.textContent).not.toContain('Row-7')
    expect(form.query('selected').get('dataSource')).toEqual([])
  })
})
