<script setup lang="ts">
import type { ISchema } from '@formily/json-schema'
import { createForm } from '@formily/core'
import { QueryFormItem, SelectTable } from '@silver-formily/element-plus'
import { createSchemaField, FormProvider } from '@silver-formily/vue'

interface UserRecord {
  id: string
  name: string
  department: string
}

const form = createForm()

const source: UserRecord[] = Array.from({ length: 80 }, (_, index) => ({
  id: `${index + 1}`,
  name: `User-${index + 1}`,
  department: index % 2 === 0 ? 'R&D' : 'Product',
}))

const querySchema: ISchema = {
  type: 'object',
  properties: {
    keyword: {
      'type': 'string',
      'title': 'Keyword',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        clearable: true,
        placeholder: 'Search by name',
      },
    },
    department: {
      'type': 'string',
      'title': 'Department',
      'enum': [
        { label: 'All', value: '' },
        { label: 'R&D', value: 'R&D' },
        { label: 'Product', value: 'Product' },
      ],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        clearable: true,
      },
    },
  },
}

async function request(params: Record<string, any>) {
  await new Promise(resolve => setTimeout(resolve, 200))

  const keyword = `${params.keyword ?? ''}`.trim().toLowerCase()
  const department = `${params.department ?? ''}`.trim()

  const filtered = source.filter((item) => {
    const keywordMatched = keyword ? item.name.toLowerCase().includes(keyword) : true
    const departmentMatched = department ? item.department === department : true
    return keywordMatched && departmentMatched
  })

  const current = Number(params.current) || 1
  const pageSize = Number(params.pageSize) || 10
  const start = (current - 1) * pageSize
  const end = current * pageSize

  return {
    data: filtered.slice(start, end),
    success: true,
    total: filtered.length,
  }
}

const schema: ISchema = {
  type: 'object',
  properties: {
    selectedUsers: {
      'type': 'array',
      'x-decorator': 'QueryFormItem',
      'x-decorator-props': {
        querySchema,
        request,
        submitText: 'Search',
        resetText: 'Reset',
        paginationProps: {
          pageSize: 8,
        },
      },
      'x-component': 'SelectTable',
      'x-component-props': {
        mode: 'multiple',
        rowKey: 'id',
        columns: [
          { prop: 'name', label: 'Name' },
          { prop: 'department', label: 'Department' },
        ],
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
</script>

<template>
  <FormProvider :form="form">
    <SchemaField :schema="schema" />
  </FormProvider>
</template>
