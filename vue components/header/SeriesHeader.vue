<template>
  <div class="series-header__wrapper">
    <div class="series-header__navigation">
      <NuxtLink class="series-header__navigation-link" to="/">Home</NuxtLink>
      <NuxtLink class="series-header__navigation-link" to="/watchListPage">Watchlist</NuxtLink>
      <NuxtLink class="series-header__navigation-link" to="/watchedListPage">Watched</NuxtLink>
    </div>
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
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 4rem 0 4rem;
    margin: 0 auto;
    gap: 1rem;
    height: 5rem;
    background: var(--dark-blue);
  }

  &__navigation {
    display: flex;
    gap: 1rem;

    &-link {
      color: var(--grey);
      text-decoration: none;

      &:hover {
        color: var(--grey);
        font-weight: bold;
      }
    }
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
