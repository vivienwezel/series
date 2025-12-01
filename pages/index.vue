<template>
  <main class="home-page" role="main">
    <div id="content-start" tabindex="-1"></div>
    <h1>List Summary</h1>
    <section class="home-page__auth" aria-label="TMDB Authentication">
      <h2>Connect to TMDB to enable writing access for private lists:</h2>
      <TMDBAuthButton/>
    </section>
  </main>
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