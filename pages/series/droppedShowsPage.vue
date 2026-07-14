<template>
  <main class="dropped-shows-page" role="main">
    <h1>wtf</h1>
    <section class="watchlist-page__search-section" aria-label="Search for TV shows">
      <TvShowSearch @item-added="handleItemAdded"/>
    </section>
    <tileContainer ref="seriesTileRef" :dropped="dropped"></tileContainer>
  </main>
</template>

<script setup>
import tileContainer from "~/vue components/tile/container/tileContainer.vue";
import {ref} from "vue";
import TvShowSearch from "~/vue components/search/TvShowSearch.vue";

const dropped = ref(true)
const seriesTileRef = ref(null)

const handleItemAdded = () => {
  // Refresh the dropped list when a new item is added
  if (seriesTileRef.value) {
    seriesTileRef.value.refreshDropped()
  }
}
</script>

<style scoped>
.dropped-shows-page {
  padding: 1.25rem;
  max-width: 75rem;
  margin: 0 auto;
}
</style>