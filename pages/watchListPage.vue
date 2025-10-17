<template>
  <div class="watchlist-page">
    <h1>My Watchlist</h1>
    <watch-list></watch-list>
  </div>
</template>

<script setup>
import WatchList from "~/vue components/lists/watchedList.vue";
</script>

<style scoped>
.watchlist-page {
  padding: 1.25rem;
  max-width: 75rem;
  margin: 0 auto;
}
</style>