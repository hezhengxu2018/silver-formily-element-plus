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
    input1: {
      'type': 'string',
      'title': 'Input 1',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    input2: {
      'type': 'string',
      'title': 'Input 2',
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
    :components="{ FormItem, Input, Select, DatePicker }"
    :max-rows="1"
  />
</template>
