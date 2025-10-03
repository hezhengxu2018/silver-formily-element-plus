<script lang="ts" setup>
import { createForm } from '@formily/core'
import { Field, FormProvider } from '@formily/vue'
import { FormItem, Submit, Switch } from '@silver-formily/element-plus'

const form = createForm()

async function log(value) {
  console.log(value)
}
</script>

<template>
  <FormProvider :form="form">
    <Field
      name="switch"
      title="开关"
      :decorator="[FormItem]"
      :component="[Switch]"
    />
    <Submit @submit="log">
      提交
    </Submit>
  </FormProvider>
</template>
