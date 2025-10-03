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
    class="VPNavScreenMenuLink"
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
.VPNavScreenMenuLink {
  display: block;
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 12px 0 11px;
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  transition:
    border-color 0.25s,
    color 0.25s;
}

.VPNavScreenMenuLink:hover {
  color: var(--vp-c-brand-1);
}
</style>
