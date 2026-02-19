<script setup lang="ts">
import type { ISchema } from '@formily/json-schema'
import { createForm } from '@formily/core'
import {
  DatePicker,
  FormItem,
  Input,
  QueryForm,
  Select,
} from '@silver-formily/element-plus'

const form = createForm()

const schema: ISchema = {
  type: 'object',
  properties: {
    keyword: {
      'type': 'string',
      'title': '关键词',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    status: {
      'type': 'string',
      'title': '状态',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'enum': [
        { label: '启用', value: 'enabled' },
        { label: '停用', value: 'disabled' },
      ],
    },
    owner: {
      'type': 'string',
      'title': '负责人',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    category: {
      'type': 'string',
      'title': '分类',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'enum': [
        { label: 'A 类', value: 'A' },
        { label: 'B 类', value: 'B' },
      ],
    },
    createdAt: {
      'type': 'string',
      'title': '创建时间',
      'x-decorator': 'FormItem',
      'x-component': 'DatePicker',
      'x-component-props': {
        type: 'daterange',
      },
    },
  },
}
</script>

<template>
  <QueryForm
    :form="form"
    :schema="schema"
    :components="{ FormItem, Input, Select, DatePicker }"
    :grid-props="{ maxColumns: 4, maxWidth: 220 }"
    actions-at-row-end
  />
</template>
