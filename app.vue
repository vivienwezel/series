<template>
  <div>
    <series-header role="banner"></series-header>
    <main
        id="main-content"
        role="main"
        tabindex="-1"
        class="main-content"
        :class="{ 'main-content--expanded': isOpen }"
    >
      <NuxtPage/>
    </main>
    <sidepanel></sidepanel>
  </div>
</template>

<script setup>
import SeriesHeader from '~/vue components/header/SeriesHeader.vue';
import Sidepanel from '~/vue components/navigation/sidepanel.vue';
import {useSidepanel} from "~/composables/useSidepanel.js";

const {isOpen} = useSidepanel();
</script>

<style>
.main-content {
  margin-left: 55px; /* closed panel width */
  transition: margin-left 0.3s ease;
}

.main-content--expanded {
  margin-left: 200px; /* open panel width */
}
</style>