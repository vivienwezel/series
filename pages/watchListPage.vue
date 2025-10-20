<template>
  <div class="watchlist-page">
    <h1>ToDo Watchlist</h1>
    <series-tile :watch="watch"></series-tile>
  </div>
</template>

<script setup>
import SeriesTile from "~/vue components/tile/SeriesTile.vue";

const watch = ref(true)
</script>

<style scoped>
.watchlist-page {
  padding: 1.25rem;
  max-width: 75rem;
  margin: 0 auto;
}
</style>