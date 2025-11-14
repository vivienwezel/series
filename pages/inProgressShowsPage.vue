<template>
  <div class="inProgress-shows-page">
    <h1>{{ $t('inProgress.page.title') }}</h1>
    <div class="watchlist-page__search-section">
      <TvShowSearch @item-added="handleItemAdded"/>
    </div>
    <series-tile ref="seriesTileRef" :inProgress="inProgress"></series-tile>
  </div>
</template>

<script setup>
import SeriesTile from "~/vue components/tile/SeriesTile.vue";
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