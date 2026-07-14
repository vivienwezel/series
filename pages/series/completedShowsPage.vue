<template>
  <main class="completed-list-page" role="main">
    <h1>Done watching</h1>
    <section class="watchlist-page__search-section" aria-label="Search for TV shows">
      <TvShowSearch @item-added="handleItemAdded"/>
    </section>
    <tileContainer ref="seriesTileRef" :completed="completed"></tileContainer>
    <!--    <series-tile ref="seriesTileRef" :completed="completed"></series-tile>-->
  </main>
</template>

<script setup>
import tileContainer from "~/vue components/tile/container/tileContainer.vue";
import {ref} from "vue";
import TvShowSearch from "~/vue components/search/TvShowSearch.vue";

const completed = ref(true)
const seriesTileRef = ref(null)

const handleItemAdded = () => {
  // Refresh the dropped list when a new item is added
  if (seriesTileRef.value) {
    seriesTileRef.value.refreshCompleted()
  }
}
</script>

<style scoped>
.completed-list-page {
  background-color: var(--background-dark);
  padding: 1.25rem;
  max-width: 75rem;
  margin: 0 auto;
}
</style>