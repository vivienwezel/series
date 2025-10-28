<template>
  <div class="home-page">
    <h2>List Summary:</h2>
    <div class="home-page__auth">
      <h3>Connect to TMDB to enable writing access for private lists:</h3>
      <TMDBAuthButton/>
    </div>
  </div>
</template>

<script setup>
import TMDBAuthButton from "~/vue components/buttons/TMDBAuthButton.vue";
</script>

<style scoped>
.home-page {
  padding: 1.25rem;
  max-width: 75rem;
  margin: 0 auto;
}

.home-page__auth {
  display: flex;
  flex-direction: column;
  align-items: start;
}
</style>