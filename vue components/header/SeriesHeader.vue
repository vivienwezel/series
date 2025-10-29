<template>
  <div class="series-header__wrapper">
    <div class="series-header__navigation">
      <NuxtLink class="series-header__navigation-link" to="/">
        <Icon name="home" />
        Home
      </NuxtLink>
      <NuxtLink class="series-header__navigation-link" to="/watchListPage">
        <Icon name="bookmark" />
        Watchlist
      </NuxtLink>
      <NuxtLink class="series-header__navigation-link" to="/inProgressShowsPage">
        <Icon name="play_circle" />
        In Progress
      </NuxtLink>
      <NuxtLink class="series-header__navigation-link" to="/completedShowsPage">
        <Icon name="check_circle" />
        Completed
      </NuxtLink>
      <NuxtLink class="series-header__navigation-link" to="/droppedShowsPage">
        <Icon name="cancel" />
        Dropped
      </NuxtLink>
    </div>
    <div class="series-header__search">
      <searchbox></searchbox>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Searchbox from "~/vue components/search/searchbox.vue";
import Icon from "~/vue components/icons/Icon.vue";
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
    gap: .5rem;

    &-link {
      display: flex;
      align-items: center;
      padding: 0 1rem;
      color: var(--grey);
      text-decoration: none;
      border-right: 2px solid var(--grey);

      &:hover {
        color: var(--grey);
        text-shadow: 0.5px 0 0 currentColor, -0.5px 0 0 currentColor;
      }

      svg {
        margin-right: 0.5rem;
        fill: var(--grey);
      }

      &:hover svg {
        fill: white;
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
