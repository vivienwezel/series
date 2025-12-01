<template>
  <div class="series-header">
    <a class="skip-link" href="#content-start" tabindex="0">Skip to main content</a>
    <div class="series-header__wrapper">
      <nav aria-label="Main navigation" class="series-header__navigation">
        <NuxtLink aria-label="Navigate to Home page" class="series-header__navigation-link" tabindex="0" to="/">
          <Icon aria-hidden="true" name="home"/>
          <span>Home</span>
        </NuxtLink>
        <NuxtLink aria-label="Navigate to Watchlist page" class="series-header__navigation-link" tabindex="0"
                  to="/watchListPage">
          <Icon aria-hidden="true" name="bookmark"/>
          <span>Watchlist</span>
        </NuxtLink>
        <NuxtLink aria-label="Navigate to In Progress shows page" class="series-header__navigation-link"
                  tabindex="0" to="/inProgressShowsPage">
          <Icon aria-hidden="true" name="play_circle"/>
          <span>In Progress</span>
        </NuxtLink>
        <NuxtLink aria-label="Navigate to Completed shows page" class="series-header__navigation-link"
                  tabindex="0" to="/completedShowsPage">
          <Icon aria-hidden="true" name="check_circle"/>
          <span>Completed</span>
        </NuxtLink>
        <NuxtLink aria-label="Navigate to Dropped shows page" class="series-header__navigation-link"
                  tabindex="0" to="/droppedShowsPage">
          <Icon aria-hidden="true" name="cancel"/>
          <span>Dropped</span>
        </NuxtLink>
      </nav>
      <div aria-label="TV show search" class="series-header__search" role="search">
        <searchbox></searchbox>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Searchbox from "~/vue components/search/searchbox.vue";
import Icon from "~/vue components/icons/Icon.vue";
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
    position: relative;
    z-index: 1;

    &-link {
      display: flex;
      align-items: center;
      padding: 0 1rem;
      color: var(--text-primary);
      text-decoration: none;
      border-right: 2px solid var(--text-primary);
      outline-offset: 2px;

      &:hover {
        color: var(--grey);
        text-shadow: 0.5px 0 0 currentColor, -0.5px 0 0 currentColor;
      }

      &:focus-visible {
        outline: 2px solid var(--button-primary, #ffd700);
        border-radius: 4px;
        color: var(--grey);
      }

      svg {
        margin-right: 0.5rem;
        fill: var(--text-primary);
      }

      &:hover svg {
        fill: white;
      }

      &:focus-visible svg {
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

.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--button-primary, #ffd700);
  color: var(--text-primary, #000);
  padding: 8px;
  text-decoration: none;
  z-index: 100;
  border-radius: 0 0 4px 0;
  font-weight: 600;
}

.skip-link:focus {
  top: 0;
}
</style>
