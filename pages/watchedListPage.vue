<template>
  <div class="watched-list-page">
    <h1>Done watching</h1>
    <series-tile :watched="watched"></series-tile>
  </div>
</template>

<script setup>
import SeriesTile from "~/vue components/tile/SeriesTile.vue";
import {ref} from "vue";

const watched = ref(true)
</script>

<style scoped>
.watched-list-page {
  padding: 1.25rem;
  max-width: 75rem;
  margin: 0 auto;
}
</style>