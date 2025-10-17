<script lang="ts">
import {defineComponent} from 'vue'
import SeriesTile from "~/vue components/tile/SeriesTile.vue";

export default defineComponent({
  name: "watchList",
  components: {SeriesTile}
})
</script>

<template>
  <series-tile></series-tile>
</template>

<style lang="less" scoped>

</style>