<script setup lang="ts">
import { useData } from 'vitepress'
import VPMenuLink from './vp-menu-link.vue'

const { theme } = useData()
const navs = theme.value.nav
</script>

<template>
  <nav v-if="navs" class="navbar-menu">
    <VPMenuLink v-for="(item, key) in navs" :key="key" :item="item" />
  </nav>
</template>
