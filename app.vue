<template>
  <div>
    
    <series-header></series-header>
    <series-page></series-page>
  </div>
</template>
<script>
import SeriesHeader from "~/vue components/SeriesHeader.vue";
import SeriesPage from "~/vue components/SeriesPage.vue";

export default {
  components: {
    SeriesPage,
    SeriesHeader
  }
}
</script>
