<script setup lang="ts">
import type { AffixProps } from 'element-plus'
import type { ComputedRef } from 'vue'
import { useForm } from '@silver-formily/vue'
import { ElAffix, useAttrs } from 'element-plus'
import { prefixCls } from './utils'

const attrs = useAttrs() as ComputedRef<Partial<AffixProps>>
const formRef = useForm()
</script>

<template>
  <ElAffix
    :class="`${prefixCls}__sticky`"
    v-bind="attrs"
    :position="attrs.position ?? 'bottom'"
    :target="attrs.target ?? `#formily-${formRef?.id}`"
  >
    <slot />
  </ElAffix>
</template>
