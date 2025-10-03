<script lang="ts" setup>
import type { DefaultTheme } from 'vitepress/theme'
import { isFunction } from 'lodash-es'
import { useData } from 'vitepress'
import { computed } from 'vue'
import { isActive } from '../shared'
import VPFlyout from './VPFlyout.vue'

const props = defineProps<{
  item: DefaultTheme.NavItemWithChildren
}>()

const { page } = useData()

function isChildActive(navItem: DefaultTheme.NavItem) {
  if ('component' in navItem)
    return false

  if ('link' in navItem) {
    return isActive(
      page.value.relativePath,
      isFunction(navItem.link) ? navItem.link(page.value) : navItem.link,
      !!props.item.activeMatch,
    )
  }

  return navItem.items.some(element => isChildActive(element))
}

const childrenActive = computed(() => isChildActive(props.item))
</script>

<template>
  <VPFlyout
    class="VPNavBarMenuGroup" :class="{
      active:
        isActive(page.relativePath, item.activeMatch, !!item.activeMatch)
        || childrenActive,
    }"
    :button="item.text"
    :items="item.items"
  />
</template>
