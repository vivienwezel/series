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
        <button @click="removeItemFromList('completed', result.id)">x</button>
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
        <button @click="removeItemFromList('dropped', result.id)">x</button>
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
        <button @click="removeItemFromList('watchlist', result.id)">x</button>
      </div>
      {{ watchListData.total_results }}
    </div>
  </div>

  <div v-show="inProgress">
    <div v-if="inProgressData" class="series-tile__wrapper">
      <div v-for="result in inProgressData.results" class="series-tile">
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
        <button class="series-tile__remove-button" @click="removeItemFromList('inProgress', result.id)">
          <Icon class="series-tile__remove-button-icon" name="trash"></Icon>
        </button>
      </div>
      {{ inProgressData.total_results }}
    </div>
  </div>

</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import Icon from '~/vue components/icons/Icon.vue'

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

  inProgress: {
    type: Boolean,
    default: false
  }
})

const completedData = ref(null)
const droppedData = ref(null)
const watchListData = ref(null)
const inProgressData = ref(null)
const imageUrl = ref('https://media.themoviedb.org/t/p/w220_and_h330_face')

onMounted(() => {
  completedShowsData()
  droppedShowsData()
  watchListShowsData()
  inProgressShowsData()
})


async function removeItemFromList(listType, mediaId) {
  const accessToken = localStorage.getItem('tmdb_access_token');

  if (!accessToken) {
    console.error('No access token found. Please authenticate first.');
    return;
  }

  try {
    const response = await $fetch('/api/listActions/removeItemFromList', {
      method: 'POST',
      headers: {
        'x-access-token': accessToken
      },
      body: {
        listType,
        items: [
          {
            media_type: 'tv',
            media_id: mediaId
          }
        ]
      }
    });
    console.log(`Successfully removed from ${listType}:`, response);

    // Refresh the appropriate list after successful removal
    switch (listType) {
      case 'watchlist':
        await watchListShowsData();
        break;
      case 'completed':
        await completedShowsData();
        break;
      case 'dropped':
        await droppedShowsData();
        break;
      case 'inProgress':
        await inProgressShowsData();
        break;
    }
  } catch (error) {
    console.error(`Error removing from ${listType}:`, error);
  }
}

async function completedShowsData() {
  completedData.value = await $fetch('/api/fetchLists/completedShows', {
    method: 'GET'
  });
  console.log(completedData.value, 'completed Data')
}

async function inProgressShowsData() {
  inProgressData.value = await $fetch('/api/fetchLists/inProgressShows', {
    method: 'GET'
  });
  console.log(inProgressData.value, 'inProgress Data')
}

async function watchListShowsData() {
  watchListData.value = await $fetch('/api/fetchLists/watchListShows', {
    method: 'GET'
  });
}

async function droppedShowsData() {
  droppedData.value = await $fetch('/api/fetchLists/droppedShows', {
    method: 'GET'
  });
}

// Expose methods so parent can trigger refresh
defineExpose({
  refreshWatchList: watchListShowsData,
  refreshCompleted: completedShowsData,
  refreshDropped: droppedShowsData,
  refreshOngoing: inProgressShowsData
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

  &__remove-button {
    height: 4rem;
    border: none;
    background: none;
  }

  &__remove-button-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    fill: var(--error-red);
    cursor: pointer;

    &:hover {
      opacity: 1;
    }

    img {
      display: block;
    }
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