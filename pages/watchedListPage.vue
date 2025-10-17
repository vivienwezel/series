<template>
  <div class="watched-list-page">
    <h1>My Watched list</h1>
    <watched-list></watched-list>
  </div>
</template>

<script setup>
import WatchedList from "~/vue components/lists/watchedList.vue";
</script>

<style scoped>
.watched-list-page {
  padding: 1.25rem;
  max-width: 75rem;
  margin: 0 auto;
}
</style>