<script setup lang="ts">
import { useData } from 'vitepress'

import VPNavbarHamburger from './navbar/vp-hamburger.vue'
import VPNavbarMenu from './navbar/vp-menu.vue'
import VPNavbarSearch from './navbar/vp-search.vue'
import VPNavbarSocialLinks from './navbar/vp-social-links.vue'
import VPNavbarThemeToggler from './navbar/vp-theme-toggler.vue'

defineProps<{
  fullScreen: boolean
}>()

defineEmits(['toggle'])

const { theme } = useData()

const currentLink = '/zh-CN/'
</script>

<template>
  <div class="navbar-wrapper">
    <div class="header-container">
      <div class="logo-container">
        <a :href="currentLink">
          <img class="logo" src="/formily-logo.svg" alt="Formily Logo">
        </a>
        <span class="title">Formily Element Plus</span>
      </div>
      <div class="content">
        <VPNavbarSearch class="search" :options="theme.agolia" multilang />
        <VPNavbarMenu class="menu" />
        <VPNavbarThemeToggler class="theme-toggler" />
        <VPNavbarSocialLinks class="social-links" />
        hamburger
        <VPNavbarHamburger :active="fullScreen" class="hamburger" @click="$emit('toggle')" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.logo-container {
  display: flex;
  align-items: center;
  height: var(--header-height);

  >a {
    width: 150px;
  }

  .logo {
    position: relative;
    vertical-align: middle;
  }

  .title {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 20px;
    margin-left: 16px;
  }
}

@media (max-width: 767px) {
  .logo-container .title {
    display: none;
  }
}

.dark {

  .logo,
  .title {
    filter: drop-shadow(2px 2px 6px #4569d4);
  }
}
</style>
