<template>
  <main class="inProgress-shows-page" role="main">
    <h1>Currently watching</h1>

    <section class="watchlist-page__search-section" aria-label="Search for TV shows">
      <TvShowSearch @item-added="handleItemAdded"/>
    </section>

    <tileContainer ref="seriesTileRef" :inProgress="inProgress"></tileContainer>
  </main>
</template>

<script setup>
import tileContainer from "~/vue components/tile/container/tileContainer.vue";
import TvShowSearch from "~/vue components/search/TvShowSearch.vue";
import {ref} from "vue";

const inProgress = ref(true)
const seriesTileRef = ref(null)

const handleItemAdded = () => {
  // Refresh the dropped list when a new item is added
  if (seriesTileRef.value) {
    seriesTileRef.value.refreshOngoing()
  }
}
</script>

<style scoped>
.inProgress-shows-page {
  padding: 1.25rem;
  max-width: 75rem;
  margin: 0 auto;
}
</style>