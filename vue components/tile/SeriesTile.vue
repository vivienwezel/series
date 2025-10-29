<template>
  <div v-show="completed">
    <div v-if="completedData" class="series-tile__wrapper">
      <div v-for="result in completedData.results" class="series-tile">
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
      {{ completedData.total_results }}
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

  <div v-show="ongoing">
    <div v-if="ongoingData" class="series-tile__wrapper">
      <div v-for="result in ongoingData.results" class="series-tile">
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
      {{ ongoingData.total_results }}
    </div>
  </div>

</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'

defineProps({
  completed: {
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
  },

  ongoing: {
    type: Boolean,
    default: false
  }
})

const completedData = ref(null)
const droppedData = ref(null)
const watchListData = ref(null)
const ongoingData = ref(null)
const imageUrl = ref('https://media.themoviedb.org/t/p/w220_and_h330_face')

onMounted(() => {
  completedShowsData()
  droppedShowsData()
  watchListShowsData()
  ongoingShowsData()
})

async function completedShowsData() {
  completedData.value = await $fetch('/api/completedShows', {
    method: 'GET'
  });
  console.log(completedData.value, 'completed Data')
}

async function ongoingShowsData() {
  ongoingData.value = await $fetch('/api/inProgressShows', {
    method: 'GET'
  });
  console.log(ongoingData.value, 'ongoing Data')
}

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

// Expose methods so parent can trigger refresh
defineExpose({
  refreshWatchList: watchListShowsData,
  refreshCompleted: completedShowsData,
  refreshDropped: droppedShowsData,
  refreshOngoing: ongoingShowsData
})

</script>
<style lang="less">
@import "../../style/variables";

.series-tile {
  display: flex;
  height: 10rem;
  box-shadow: var(--tile-box-shadow);
  border-radius: .5rem;
  border: 1px solid var(--grey);
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
</style>