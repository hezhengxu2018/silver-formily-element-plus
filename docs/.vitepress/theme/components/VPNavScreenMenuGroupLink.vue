<script lang="ts" setup>
import type { DefaultTheme } from 'vitepress/theme'
import { isFunction } from 'lodash-es'
import { useData } from 'vitepress'
import { computed, inject } from 'vue'
import { navInjectionKey } from '../composables/nav'
import VPLink from './VPLink.vue'

const props = defineProps<{
  item: DefaultTheme.NavItemWithLink
}>()

const { page } = useData()

const href = computed(() =>
  isFunction(props.item.link)
    ? props.item.link(page.value)
    : props.item.link,
)

const { closeScreen } = inject(navInjectionKey)!
</script>

<template>
  <VPLink
    class="VPNavScreenMenuGroupLink"
    :href
    :target="item.target"
    :rel="item.rel"
    :no-icon="item.noIcon"
    @click="closeScreen"
  >
    <span v-html="item.text" />
  </VPLink>
</template>

<style scoped>
.VPNavScreenMenuGroupLink {
  display: block;
  margin-left: 12px;
  line-height: 32px;
  font-size: 14px;
  font-weight: 400;
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}

.VPNavScreenMenuGroupLink:hover {
  color: var(--vp-c-brand-1);
}
</style>
