<template>
  <div class="dropped-shows-page">
    <h1>wtf</h1>
    <div class="watchlist-page__search-section">
      <TvShowSearch @item-added="handleItemAdded"/>
    </div>
    <tileContainer ref="seriesTileRef" :dropped="dropped"></tileContainer>
  </div>
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