<script setup lang="ts">
import { useData } from 'vitepress'
import VpNavFull from './vp-nav-full.vue'
import VpNavbar from './vp-navbar.vue'

const { site } = useData()
console.log(site.value)
</script>

<template>
  <header class="navbar">
    <VpNavbar :full-screen="false" />
    <VpNavFull :full-screen="true" />
  </header>
</template>
