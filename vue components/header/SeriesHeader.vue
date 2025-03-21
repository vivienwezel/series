<template>
  <div class="series-header__wrapper">
    <div class="series-header__search">
      <searchbox></searchbox>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Searchbox from "~/vue components/search/searchbox.vue";
</script>

<style lang="less">

.series-header {
  &__wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    height: 10rem;
    background: var(--onyx);
  }

  &__search {
    &-form {
      display: flex;
    }

    &-input {
      width: 30rem;
      height: 2rem;
    }

    &-submit-button {
      width: 5rem;
    }
  }
}
</style>
