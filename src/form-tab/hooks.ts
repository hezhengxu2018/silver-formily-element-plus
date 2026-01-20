import type { Schema, SchemaKey } from '@formily/json-schema'
import { observable, reaction } from '@formily/reactive'
import { useField, useFieldSchema } from '@silver-formily/vue'

export type Tabs = { name: SchemaKey, props: any, schema: Schema }[]

export function useTabs() {
  const tabsField = useField()
  const schema = useFieldSchema()
  const tabs: Tabs = observable([])
  reaction(() => {
    const tabDisplayStatus = schema.value?.mapProperties((schema, name) => {
      const field = tabsField.value
        .query(tabsField.value.address.concat(name))
        .take()
      return field?.display
    })
    return tabDisplayStatus
  }, () => {
    tabs.length = 0
    schema.value?.mapProperties((schema, name) => {
      const field = tabsField.value
        .query(tabsField.value.address.concat(name))
        .take()
      if (field?.display === 'none' || field?.display === 'hidden')
        return

      if (schema['x-component']?.indexOf('TabPane') > -1) {
        tabs.push({
          name,
          props: {
            name: schema?.['x-component-props']?.name || name,
            ...schema?.['x-component-props'],
          },
          schema,
        })
      }
    })
  }, {
    fireImmediately: true,
  })

  return tabs
}
