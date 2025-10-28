<template>
  <div class="ongoing-shows-page">
    <h1>Currently watching</h1>
    <series-tile :ongoing="ongoing"></series-tile>
  </div>
</template>

<script setup>
import SeriesTile from "~/vue components/tile/SeriesTile.vue";
import {ref} from "vue";

const ongoing = ref(true)
</script>

<style scoped>
.ongoing-shows-page {
  padding: 1.25rem;
  max-width: 75rem;
  margin: 0 auto;
}
</style>