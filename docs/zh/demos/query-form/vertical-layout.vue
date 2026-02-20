<script setup lang="ts">
import type { ISchema } from '@formily/json-schema'
import { createForm } from '@formily/core'
import { QueryForm } from '@silver-formily/element-plus'

const form = createForm()

const schema: ISchema = {
  type: 'object',
  properties: {
    keyword: {
      'type': 'string',
      'title': 'Keyword',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    status: {
      'type': 'string',
      'title': 'Status',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'enum': [
        { label: 'Enabled', value: 'enabled' },
        { label: 'Disabled', value: 'disabled' },
      ],
    },
    owner: {
      'type': 'string',
      'title': 'Owner',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    department: {
      'type': 'string',
      'title': 'Department',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
  },
}
</script>

<template>
  <QueryForm
    :form="form"
    :schema="schema"
    layout="vertical"
    :grid-props="{ maxColumns: 2, maxWidth: 280 }"
  />
</template>
