<template>
  <div class='series-header'>
    <div class='series-header__wrapper'>
      <div v-if='activeSectionComponent'>
        <component :is='activeSectionComponent'/>
      </div>
    </div>
  </div>
</template>


<script lang='ts' setup>
import SeriesMenu from '~/vue components/navigation/seriesMenu.vue';
import AnimeMenu from '~/vue components/navigation/animeMenu.vue';
import BooksMenu from '~/vue components/navigation/booksMenu.vue';

const route = useRoute();

const activeSectionComponent = computed(() => {
  if (route.path.startsWith('/series')) {
    return SeriesMenu;
  }
  if (route.path.startsWith('/anime')) {
    return AnimeMenu;
  }
  if (route.path.startsWith('/books')) {
    return BooksMenu;
  }
  return null;
});
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
    width: 100%;
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