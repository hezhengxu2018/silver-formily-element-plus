<script lang="ts" setup>
import type { DefaultTheme } from 'vitepress/theme'
// import { onKeyStroke } from '@vueuse/core'
import { useData } from 'vitepress'
import { onMounted, onUnmounted, ref } from 'vue'
// import VPNavBarSearchButton from './VPNavBarSearchButton.vue'
// import '@docsearch/css'

const VPLocalSearchBox = () => null

const VPAlgoliaSearchBox = () => null

const { theme } = useData()

// to avoid loading the docsearch js upfront (which is more than 1/3 of the
// payload), we delay initializing it until the user has actually clicked or
// hit the hotkey to invoke it.
const loaded = ref(false)
const actuallyLoaded = ref(false)

function preconnect() {
  const id = 'VPAlgoliaPreconnect'

  const rIC = globalThis.requestIdleCallback || setTimeout
  rIC(() => {
    const preconnect = document.createElement('link')
    preconnect.id = id
    preconnect.rel = 'preconnect'
    preconnect.href = `https://${
      ((theme.value.search?.options as DefaultTheme.AlgoliaSearchOptions)
        ?? theme.value.algolia)!.appId
    }-dsn.algolia.net`
    preconnect.crossOrigin = ''
    document.head.append(preconnect)
  })
}

onMounted(() => {
  // if (!__ALGOLIA__) {
  //   return
  // }

  preconnect()

  const handleSearchHotKey = (event: KeyboardEvent) => {
    if (
      (event.key?.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey))
      || (!isEditingContent(event) && event.key === '/')
    ) {
      event.preventDefault()
      load()
      // eslint-disable-next-line ts/no-use-before-define
      remove()
    }
  }

  const remove = () => {
    globalThis.removeEventListener('keydown', handleSearchHotKey)
  }

  globalThis.addEventListener('keydown', handleSearchHotKey)

  onUnmounted(remove)
})

function load() {
  if (!loaded.value) {
    loaded.value = true
    setTimeout(poll, 16)
  }
}

function poll() {
  // programmatically open the search box after initialize
  const e = new Event('keydown') as any

  e.key = 'k'
  e.metaKey = true

  globalThis.dispatchEvent(e)

  setTimeout(() => {
    if (!document.querySelector('.DocSearch-Modal')) {
      poll()
    }
  }, 16)
}

function isEditingContent(event: KeyboardEvent): boolean {
  const element = event.target as HTMLElement
  const tagName = element.tagName

  return (
    element.isContentEditable
    || tagName === 'INPUT'
    || tagName === 'SELECT'
    || tagName === 'TEXTAREA'
  )
}

// Local search

const showSearch = ref(false)

// if (__VP_LOCAL_SEARCH__) {
//   onKeyStroke('k', (event) => {
//     if (event.ctrlKey || event.metaKey) {
//       event.preventDefault()
//       showSearch.value = true
//     }
//   })

//   onKeyStroke('/', (event) => {
//     if (!isEditingContent(event)) {
//       event.preventDefault()
//       showSearch.value = true
//     }
//   })
// }

// const provider = __ALGOLIA__ ? 'algolia' : (__VP_LOCAL_SEARCH__ ? 'local' : '')
const provider = 'local'
</script>

<template>
  <div class="VPNavBarSearch">
    <template v-if="provider === 'local'">
      <VPLocalSearchBox
        v-if="showSearch"
        @close="showSearch = false"
      />

      <div id="local-search">
        <VPNavBarSearchButton @click="showSearch = true" />
      </div>
    </template>

    <template v-else-if="provider === 'algolia'">
      <VPAlgoliaSearchBox
        v-if="loaded"
        :algolia="theme.search?.options ?? theme.algolia"
        @vue:before-mount="actuallyLoaded = true"
      />

      <div v-if="!actuallyLoaded" id="docsearch">
        <VPNavBarSearchButton @click="load" />
      </div>
    </template>
  </div>
</template>

<style>
.VPNavBarSearch {
  display: flex;
  align-items: center;
}

@media (min-width: 768px) {
  .VPNavBarSearch {
    flex-grow: 1;
    padding-left: 24px;
  }
}

@media (min-width: 960px) {
  .VPNavBarSearch {
    padding-left: 32px;
  }
}
</style>
