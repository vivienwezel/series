<template>
  <div class="dropped-shows-page">
    <h1>{{ $t('dropped.page.title') }}</h1>
    <div class="watchlist-page__search-section">
      <TvShowSearch @item-added="handleItemAdded"/>
    </div>
    <series-tile ref="seriesTileRef" :dropped="dropped"></series-tile>
  </div>
</template>

<script setup>
import SeriesTile from "~/vue components/tile/SeriesTile.vue";
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