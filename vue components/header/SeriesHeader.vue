<template>
  <div class="series-header">
    <div class="series-header__wrapper">
      <div class="series-header__navigation">
        <NuxtLink :to="localePath('/')" class="series-header__navigation-link">
          <Icon name="home"/>
          {{ $t('header.home') }}
        </NuxtLink>
        <NuxtLink :to="localePath('/watchListPage')" class="series-header__navigation-link">
          <Icon name="bookmark"/>
          {{ $t('header.watchlist') }}
        </NuxtLink>
        <NuxtLink :to="localePath('/inProgressShowsPage')" class="series-header__navigation-link">
          <Icon name="play_circle"/>
          {{ $t('header.inProgress') }}
        </NuxtLink>
        <NuxtLink :to="localePath('/completedShowsPage')" class="series-header__navigation-link">
          <Icon name="check_circle"/>
          {{ $t('header.completed') }}
        </NuxtLink>
        <NuxtLink :to="localePath('/droppedShowsPage')" class="series-header__navigation-link">
          <Icon name="cancel"/>
          {{ $t('header.dropped') }}
        </NuxtLink>
        <NuxtLink :to="localePath('/strapiPage')" class="series-header__navigation-link">
          <Icon name="trash"/>
          {{ $t('header.strapi') }}
        </NuxtLink>
      </div>
      <!--      <div class="series-header__search">-->
      <!--        <searchbox></searchbox>-->
      <!--      </div>-->
    </div>
  </div>
</template>

<script lang="ts" setup>
import Icon from "~/vue components/icons/Icon.vue";

const localePath = useLocalePath()
</script>

<style lang="less">

.series-header {
  display: flex;
  margin: -.5rem;

  &__wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 4rem 0 4rem;
    margin: 0 auto;
    gap: 1rem;
    height: 5rem;
    background: var(--header-background);
  }

  &__navigation {
    display: flex;
    gap: .5rem;

    &-link {
      display: flex;
      align-items: center;
      padding: 0 1rem;
      color: var(--text-primary);
      text-decoration: none;
      border-right: 2px solid var(--text-primary);

      &:hover {
        color: var(--grey);
        text-shadow: 0.5px 0 0 currentColor, -0.5px 0 0 currentColor;
      }

      svg {
        margin-right: 0.5rem;
        fill: var(--text-primary);
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
