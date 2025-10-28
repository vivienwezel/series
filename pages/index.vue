<template>
  <div class="home-page">
    <h1>My Series Tracker</h1>
    <TMDBAuthButton/>
  </div>
</template>

<script setup>
import TMDBAuthButton from "~/components/TMDBAuthButton.vue";
</script>

<style scoped>
.home-page {
  padding: 1.25rem;
  max-width: 75rem;
  margin: 0 auto;
}
</style>