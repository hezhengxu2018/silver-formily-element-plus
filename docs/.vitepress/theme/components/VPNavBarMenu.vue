<script lang="ts" setup>
import { useData } from 'vitepress'
import VPNavBarMenuGroup from './VPNavBarMenuGroup.vue'
import VPNavBarMenuLink from './VPNavBarMenuLink.vue'

const { theme } = useData()
</script>

<template>
  <nav
    v-if="theme.nav"
    aria-labelledby="main-nav-aria-label"
    class="VPNavBarMenu"
  >
    <span id="main-nav-aria-label" class="visually-hidden">
      Main Navigation
    </span>
    <template v-for="item in theme.nav" :key="JSON.stringify(item)">
      <VPNavBarMenuLink v-if="'link' in item" :item />
      <component
        :is="item.component"
        v-else-if="'component' in item"
        v-bind="item.props"
      />
      <VPNavBarMenuGroup v-else :item />
    </template>
  </nav>
</template>

<style scoped>
.VPNavBarMenu {
  display: none;
}

@media (min-width: 768px) {
  .VPNavBarMenu {
    display: flex;
  }
}
</style>
