<template>
  <div class="series-dashboard-page">
    <div class="series-dashboard-page__header">
      Series Dashboard
    </div>
    <section class="series-dashboard-page__auth" aria-label="TMDB Authentication">
      <h3>Connect to TMDB to enable writing access for private lists:</h3>
      <TMDBAuthButton/>
    </section>
  </div>
</template>

<script setup>
import TMDBAuthButton from '~/vue components/buttons/TMDBAuthButton.vue';
</script>

<style scoped lang="less">
.series-dashboard-page {
  padding: 1.25rem;
  max-width: 75rem;
  margin: 1rem auto;
  background-color: var(--grey);
  border-radius: 1rem;

  &__header {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  &__auth {

  }
}
</style>
