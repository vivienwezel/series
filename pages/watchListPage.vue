<template>
  <div class="watchlist-page">
    <h1>Plan To Watch</h1>

    <div class="watchlist-page__search-section">
      <TvShowSearch/>
    </div>

    <series-tile :watch="watch"></series-tile>
  </div>
</template>

<script setup>
import SeriesTile from "~/vue components/tile/SeriesTile.vue";
import TvShowSearch from "~/vue components/search/TvShowSearch.vue";

const watch = ref(true)
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