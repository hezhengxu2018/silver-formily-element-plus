<script lang="ts" setup>
import type { DefaultTheme } from 'vitepress/theme'
import { isFunction } from 'lodash-es'
import { useData } from 'vitepress'
import { computed } from 'vue'
import { isActive } from '../shared'
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
</script>

<template>
  <VPLink
    class="VPNavBarMenuLink" :class="{
      active: isActive(
        page.relativePath,
        item.activeMatch || href,
        !!item.activeMatch,
      ),
    }"
    :href
    :target="item.target"
    :rel="item.rel"
    :no-icon="item.noIcon"
    tabindex="0"
  >
    <span v-html="item.text" />
  </VPLink>
</template>

<style scoped>
.VPNavBarMenuLink {
  display: flex;
  align-items: center;
  padding: 0 12px;
  line-height: calc(var(--vp-nav-height) - 3px);
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}

.VPNavBarMenuLink.active {
  color: var(--vp-c-brand-1);
  border-bottom: 2px solid var(--vp-c-brand-1);
}

.VPNavBarMenuLink:hover {
  color: var(--vp-c-brand-1);
}
</style>
