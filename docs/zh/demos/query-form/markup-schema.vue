<script setup lang="ts">
import { createForm } from '@formily/core'
import {
  DatePicker,
  FormItem,
  Input,
  QueryForm,
  Select,
} from '@silver-formily/element-plus'
import { createSchemaField, FormProvider } from '@silver-formily/vue'

const form = createForm()
const { SchemaField, SchemaObjectField, SchemaStringField } = createSchemaField({
  components: {
    QueryForm,
    Input,
    Select,
    DatePicker,
    FormItem,
  },
})
</script>

<template>
  <FormProvider :form="form">
    <SchemaField>
      <SchemaObjectField x-component="QueryForm">
        <SchemaStringField
          name="input1"
          title="Input 1"
          x-component="Input"
          x-decorator="FormItem"
        />
        <SchemaStringField
          name="input2"
          title="Input 2"
          x-component="Input"
          x-decorator="FormItem"
        />
        <SchemaStringField
          name="select1"
          title="Select 1"
          x-component="Select"
          x-decorator="FormItem"
        />
        <SchemaStringField
          name="select2"
          title="Select 2"
          x-component="Select"
          x-decorator="FormItem"
        />
        <SchemaStringField
          name="date"
          title="DatePicker"
          x-component="DatePicker"
          x-decorator="FormItem"
        />
        <SchemaStringField
          name="dateRange"
          title="DatePicker"
          x-component="DatePicker"
          x-decorator="FormItem"
          :x-decorator-props="{
            gridSpan: 'span 2',
          }"
          :x-component-props="{
            type: 'daterange',
          }"
        />
        <SchemaStringField
          name="select3"
          title="Select 3"
          x-component="Select"
          x-decorator="FormItem"
        />
      </SchemaObjectField>
    </SchemaField>
  </FormProvider>
</template>
