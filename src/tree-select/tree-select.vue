<script setup lang="ts">
import type { Field } from '@formily/core'
import { useField } from '@silver-formily/vue'
import { ElTreeSelect } from 'element-plus'
import { ref, useSlots } from 'vue'
import { useCleanAttrs } from '../__builtins__'

defineOptions({
  name: 'FSelectTree',
  inheritAttrs: false,
})

const props = defineProps<{
  value: any
}>()

const emit = defineEmits(['change'])

const slots = useSlots()

const { props: attrs } = useCleanAttrs()

const treeSelectRef = ref()

const fieldRef = useField<Field>()

fieldRef.value?.inject({
  getTreeSelectRef: () => {
    return treeSelectRef
  },
})
</script>

<template>
  <ElTreeSelect
    ref="treeSelectRef"
    :model-value="props.value"
    :loading="fieldRef.value?.loading"
    v-bind="attrs"
    @update:model-value="emit('change', $event)"
  >
    <template v-for="(_, name) of slots" #[name]="slotData">
      <slot :name="name" v-bind="{ field: fieldRef, ...slotData }" />
    </template>
  </ElTreeSelect>
</template>
