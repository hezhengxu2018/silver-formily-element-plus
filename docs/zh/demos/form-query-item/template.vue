<script setup lang="ts">
import { createForm } from '@formily/core'
import { FormLayout, FormQueryItem, Input } from '@silver-formily/element-plus'
import { Field, FormProvider } from '@silver-formily/vue'

const form = createForm()
</script>

<template>
  <FormProvider :form="form">
    <FormLayout
      :breakpoints="[680]"
      layout="horizontal"
      label-align="left"
    >
      <Field
        name="query"
        title="查询框"
        :decorator="[FormQueryItem]"
        :component="[Input]"
        :required="true"
      />
    </FormLayout>
  </FormProvider>
</template>
