<template>
  <div>

    <series-header></series-header>
    <series-tile></series-tile>
  </div>
</template>
<script>
import SeriesHeader from "~/vue components/header/SeriesHeader.vue";
import SeriesTile from "~/vue components/SeriesTile.vue";

export default {
  components: {
    SeriesTile,
    SeriesHeader
  }
}
</script>
