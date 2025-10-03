<script lang="ts" setup>
import { createForm } from '@formily/core'
import { Field, FormProvider } from '@formily/vue'
import { FormItem, Select, Submit } from '@silver-formily/element-plus'

const form = createForm()

async function log(value) {
  console.log(value)
}
</script>

<template>
  <FormProvider :form="form">
    <Field
      name="select"
      title="选择框"
      :decorator="[FormItem]"
      :component="[
        Select,
        {
          style: {
            width: '240px',
          },
        },
      ]"
      :data-source="[
        {
          label: '选项1',
          value: 1,
        },
        {
          label: '选项2',
          value: 2,
        },
      ]"
    />

    <Submit @submit="log">
      提交
    </Submit>
  </FormProvider>
</template>
