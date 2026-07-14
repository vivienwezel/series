<template>
  <nav ref="navRef" class="sidepanel" :class="{ open: isOpen, closed: !isOpen }" @click="openSidepanel"
       role="navigation"
       aria-label="Series navigation">
    <div class="sidepanel__item-wrapper">
      <div class="sidepanel__close-open">
        <Icon v-if="isOpen" class="sidepanel__close" @click.stop="closeSidepanel" name="sidepanel_close"
              aria-hidden="true"/>
        <Icon v-else class="sidepanel__open" @click.stop="openSidepanel" name="sidepanel_open" aria-hidden="true"/>
      </div>
      <ul class="sidepanel__list">
        <li class="sidepanel__item">
          <div class="sidepanel__item--home">
            <NuxtLink to="/" class="sidepanel__link">
              <Icon name="home" aria-hidden="true"/>
              <span v-show="isOpen">Home</span>
            </NuxtLink>
          </div>
          <NuxtLink to="/series/seriesDashboardPage" class="sidepanel__link">
            <Icon name="tv" aria-hidden="true"/>
            <span v-show="isOpen">Series</span>
          </NuxtLink>
          <NuxtLink to="/anime/animeDashboardPage" class="sidepanel__link">
            <Icon name="sunset" aria-hidden="true"/>
            <span v-show="isOpen">Anime</span>
          </NuxtLink>
          <NuxtLink to="/books/booksDashboardPage" class="sidepanel__link">
            <Icon name="book" aria-hidden="true"/>
            <span v-show="isOpen">Books</span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import Icon from '~/vue components/icons/Icon.vue';
import {useSidepanel} from "~/composables/useSidepanel.js";

const {isOpen} = useSidepanel();
const navRef = ref(null);

function openSidepanel() {
  isOpen.value = true;
}

function closeSidepanel() {
  isOpen.value = false;
}

</script>

<style lang="less" scoped>

nav {
  position: fixed;
  display: block;
  height: 100%;
  width: 200px;
  top: 0;
  left: 0;
  z-index: 100;
  overflow-y: auto;
  padding: 1rem;
}

.sidepanel {
  background-color: var(--beige);
  box-shadow: var(--tile-box-shadow);

  &.open {
    width: 12.5rem;
    transition: width 0.3s ease;

    .sidepanel__item-wrapper {
      margin-left: 0.46rem;
    }

    .sidepanel__close-open {
      display: flex;
      justify-content: flex-end;
    }
  }

  &.closed {
    width: 3.4375rem;
    transition: width 0.3s ease;

    .sidepanel__item-wrapper {
      margin-left: 0.46rem;
      align-items: flex-start;
    }
  }

  &__close-open {
    height: 1rem;
    margin-bottom: 2rem;
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &__item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__item-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .icon-wrapper :deep(svg) {
    fill: var(--text-secondary);
  }

  &__link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-secondary);
    text-decoration: none;
    padding: 0.5rem;

    &:hover {
      cursor: pointer;
      background-color: var(--dark-grey);
      border-radius: 0.1875rem;
    }

    &:active {
      cursor: pointer;
      background-color: var(--dark-grey);
      border-radius: 0.1875rem;
    }
  }

  &__close {
    display: flex;
    align-self: flex-start;
    cursor: pointer;
  }

}

</style>
