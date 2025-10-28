<template>
  <div v-show="watched">
    <div v-if="watchedData" class="series-tile__wrapper">
      <div v-for="result in watchedData.results" class="series-tile">
        <div class="series-tile__image-wrapper">
          <div class="series-tile__image">
            <img :alt="'Bild der Serie ' + result.original_name" :src="imageUrl + result.poster_path"
                 class="series-tile__img">
          </div>
        </div>
        <div class="series-tile__info-wrapper">
          <div class="series-tile__title">{{ result.original_name }}</div>
          <div class="series-tile__description">{{ result.overview }}</div>
          <div class="series-tile__airdate">{{ result.first_air_date }}</div>
        </div>
      </div>
      {{ watchedData.total_results }}
    </div>
  </div>

  <div v-show="dropped">
    <div v-if="droppedData" class="series-tile__wrapper">
      <div v-for="result in droppedData.results" class="series-tile">
        <div class="series-tile__image-wrapper">
          <div class="series-tile__image">
            <img :alt="'Bild der Serie ' + result.original_name" :src="imageUrl + result.poster_path"
                 class="series-tile__img">
          </div>
        </div>
        <div class="series-tile__info-wrapper">
          <div class="series-tile__title">{{ result.original_name }}</div>
          <div class="series-tile__description">{{ result.overview }}</div>
          <div class="series-tile__airdate">{{ result.first_air_date }}</div>
        </div>
      </div>
      {{ droppedData.total_results }}
    </div>
  </div>

  <div v-show="watch">
    <div v-if="watchListData" class="series-tile__wrapper">
      <div v-for="result in watchListData.results" class="series-tile">
        <div class="series-tile__image-wrapper">
          <div class="series-tile__image">
            <img :alt="'Bild der Serie ' + result.original_name" :src="imageUrl + result.poster_path"
                 class="series-tile__img">
          </div>
        </div>
        <div class="series-tile__info-wrapper">
          <div class="series-tile__title">{{ result.original_name }}</div>
          <div class="series-tile__description">{{ result.overview }}</div>
          <div class="series-tile__airdate">{{ result.first_air_date }}</div>
        </div>
      </div>
      {{ watchListData.total_results }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'

defineProps({
  watched: {
    type: Boolean,
    default: false
  },

  watch: {
    type: Boolean,
    default: false
  },

  dropped: {
    type: Boolean,
    default: false
  }
})

const watchedData = ref(null)
const droppedData = ref(null)
const watchListData = ref(null)
const imageUrl = ref('https://media.themoviedb.org/t/p/w220_and_h330_face')

onMounted(() => {
  watchedShowsData()
  droppedShowsData()
  watchListShowsData()
  // receiveWritingPermission.createTokenRequest()
})

async function watchedShowsData() {
  watchedData.value = await $fetch('/api/watchedShows', {
    method: 'GET'
  });
  console.log(watchedData.value, 'watched Data')
}

// async function createTokenRequest() {
//
// }

async function watchListShowsData() {
  watchListData.value = await $fetch('/api/watchListShows', {
    method: 'GET'
  });
}

async function droppedShowsData() {
  droppedData.value = await $fetch('/api/droppedShows', {
    method: 'GET'
  });
}

</script>
<style lang="less">
@import "../../style/variables";

.series-tile {
  display: flex;
  height: 10rem;
  box-shadow: var(--tile-box-shadow);
  border-radius: .5rem;
  background-color: var(--grey);
  gap: 2rem;

  &__title {
    font-weight: bold;
  }

  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__info-wrapper {
    flex-basis: 90%;
    padding: 1rem;
  }

  &__image-wrapper {
    flex-basis: 10%;
  }

  &__image {
    border-top-left-radius: .5rem;
    border-bottom-left-radius: .5rem;
  }

  &__img {
    height: 10rem;
    border-top-left-radius: .5rem;
    border-bottom-left-radius: .5rem;
  }
}

;
</style>