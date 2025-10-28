<template>
  <div class="completed-list-page">
    <h1>Done watching</h1>
    <series-tile :completed="completed"></series-tile>
  </div>
</template>

<script setup>
import SeriesTile from "~/vue components/tile/SeriesTile.vue";
import {ref} from "vue";

const completed = ref(true)
</script>

<style scoped>
.completed-list-page {
  padding: 1.25rem;
  max-width: 75rem;
  margin: 0 auto;
}
</style>