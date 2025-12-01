<template>
  <div>
    <series-header role="banner"></series-header>
    <main id="main-content" role="main" tabindex="-1">
      <NuxtPage/>
    </main>
  </div>
</template>

<script setup>
import SeriesHeader from "~/vue components/header/SeriesHeader.vue";
</script>

