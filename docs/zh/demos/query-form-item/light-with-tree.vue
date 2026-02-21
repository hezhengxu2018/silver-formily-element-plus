<script setup lang="ts">
import type { ISchema } from '@formily/json-schema'
import { createForm } from '@formily/core'
import { QueryFormItem, Tree } from '@silver-formily/element-plus'
import { createSchemaField, FormProvider } from '@silver-formily/vue'

interface TreeNode {
  id: number
  label: string
  children?: TreeNode[]
}

const form = createForm()

const source: TreeNode[] = [
  {
    id: 1,
    label: 'East Region',
    children: [
      { id: 11, label: 'Shanghai' },
      { id: 12, label: 'Hangzhou' },
    ],
  },
  {
    id: 2,
    label: 'South Region',
    children: [
      { id: 21, label: 'Shenzhen' },
      { id: 22, label: 'Guangzhou' },
    ],
  },
]

function filterTree(nodes: TreeNode[], keyword: string): TreeNode[] {
  if (!keyword)
    return nodes

  return nodes
    .map((node) => {
      const children = node.children ? filterTree(node.children, keyword) : undefined
      if (node.label.includes(keyword) || (children && children.length > 0)) {
        return { ...node, children }
      }
      return null
    })
    .filter(Boolean) as TreeNode[]
}

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
        placeholder: 'Filter node name',
      },
    },
  },
}

async function request(values: Record<string, any>) {
  await new Promise(resolve => setTimeout(resolve, 150))
  const keyword = `${values.keyword ?? ''}`.trim()
  const data = filterTree(source, keyword)

  return {
    data,
    success: true,
    total: data.length,
  }
}

const schema: ISchema = {
  type: 'object',
  properties: {
    selectedNodes: {
      'type': 'array',
      'x-decorator': 'QueryFormItem',
      'x-decorator-props': {
        querySchema,
        request,
        mode: 'light',
        throttleWait: 200,
        paginationProps: {
          enabled: false,
        },
      },
      'x-component': 'Tree',
      'x-component-props': {
        nodeKey: 'id',
        maxHeight: 260,
      },
    },
  },
}

const { SchemaField } = createSchemaField({
  components: {
    QueryFormItem,
    Tree,
  },
})
</script>

<template>
  <FormProvider :form="form">
    <SchemaField :schema="schema" />
  </FormProvider>
</template>
