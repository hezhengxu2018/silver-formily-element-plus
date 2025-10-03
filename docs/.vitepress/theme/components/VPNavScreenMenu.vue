<script lang="ts" setup>
import { useData } from 'vitepress'
import VPNavScreenMenuGroup from './VPNavScreenMenuGroup.vue'
import VPNavScreenMenuLink from './VPNavScreenMenuLink.vue'

const { theme } = useData()
</script>

<template>
  <nav v-if="theme.nav" class="VPNavScreenMenu">
    <template v-for="item in theme.nav" :key="JSON.stringify(item)">
      <VPNavScreenMenuLink v-if="'link' in item" :item />
      <component
        :is="item.component"
        v-else-if="'component' in item"
        v-bind="item.props"
        screen-menu
      />
      <VPNavScreenMenuGroup
        v-else
        :text="item.text || ''"
        :items="item.items"
      />
    </template>
  </nav>
</template>
