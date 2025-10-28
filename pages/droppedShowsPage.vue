<template>
  <div class="dropped-shows-page">
    <h1>Didn't finish</h1>
    <series-tile :dropped="dropped"></series-tile>
  </div>
</template>

<script setup>
import SeriesTile from "~/vue components/tile/SeriesTile.vue";
import {ref} from "vue";

const dropped = ref(true)
</script>

<style scoped>
.dropped-shows-page {
  padding: 1.25rem;
  max-width: 75rem;
  margin: 0 auto;
}
</style>