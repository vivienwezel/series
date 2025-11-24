<template>
  <div class="watchlist-page">
    <h1>Plan To Watch</h1>

    <div class="watchlist-page__search-section">
      <TvShowSearch @item-added="handleItemAdded"/>
    </div>

    <tileContainer ref="seriesTileRef" :watch="watch"></tileContainer>
  </div>
</template>

<script setup>
import tileContainer from "~/vue components/tile/container/tileContainer.vue";
import TvShowSearch from "~/vue components/search/TvShowSearch.vue";
import {ref} from "vue";

const watch = ref(true)
const seriesTileRef = ref(null)

const handleItemAdded = () => {
  // Refresh the watchlist when a new item is added
  if (seriesTileRef.value) {
    seriesTileRef.value.refreshWatchList()
  }
}
</script>

<style scoped>
.watchlist-page {
  padding: 1.25rem;
  max-width: 75rem;
  margin: 0 auto;

  &__search-section {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background-color: var(--background-secondary, #f9f9f9);
    border-radius: 0.5rem;
  }
}
</style>