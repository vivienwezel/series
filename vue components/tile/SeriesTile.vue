<template>
  <div v-show="completed">
    <div v-if="completedData" class="series-tile__wrapper">
      <div v-if="completedTotalRuntime > 0" class="series-tile__summary">
        <strong>Total Runtime:</strong> {{ formatRuntime(completedTotalRuntime) }} ({{ completedData.total_results }}
        shows)
      </div>
      <div v-for="result in completedData.results" class="series-tile">
        <div class="series-tile__image-wrapper">
          <div class="series-tile__image">
            <img :alt="'Bild der Serie ' + result.original_name" :src="imageUrl + result.poster_path"
                 class="series-tile__img">
          </div>
        </div>
        <div class="series-tile__info-wrapper">
          <div class="series-tile__title">{{ result.original_name }}</div>
          <div>{{ result.details?.number_of_seasons }} Seasons / {{ result.details.number_of_episodes }} Episodes</div>
          <div v-if="calculateTotalRuntime(result) > 0" class="series-tile__runtime">
            Total Runtime: {{ formatRuntime(calculateTotalRuntime(result)) }}
          </div>
          <br>
          <div class="series-tile__description">{{ result.overview }}</div>
        </div>
        <button class="series-tile__remove-button" @click="removeItemFromList('completed', result.id)">
          <Icon class="series-tile__remove-button-icon" name="trash"></Icon>
        </button>
      </div>
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
          <div v-if="calculateTotalRuntime(result) > 0" class="series-tile__runtime">
            Total Runtime: {{ formatRuntime(calculateTotalRuntime(result)) }}
          </div>
        </div>
        <button class="series-tile__remove-button" @click="removeItemFromList('dropped', result.id)">
          <Icon class="series-tile__remove-button-icon" name="trash"></Icon>
        </button>
      </div>
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
          <div>{{ result.details?.number_of_seasons }} Seasons / {{ result.details.number_of_episodes }} Episodes</div>
          <div v-if="calculateTotalRuntime(result) > 0" class="series-tile__runtime">
            Total Runtime: {{ formatRuntime(calculateTotalRuntime(result)) }}
          </div>
          <br>
          <div class="series-tile__description">{{ result.overview }}</div>
        </div>
        <button class="series-tile__remove-button" @click="removeItemFromList('watchlist', result.id)">
          <Icon class="series-tile__remove-button-icon" name="trash"></Icon>
        </button>
      </div>
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
          <div>{{ result.details?.number_of_seasons }} Seasons / {{ result.details.number_of_episodes }} Episodes</div>
          <div v-if="calculateTotalRuntime(result) > 0" class="series-tile__runtime">
            Total Runtime: {{ formatRuntime(calculateTotalRuntime(result)) }}
          </div>
          <br>
          <div class="series-tile__description">{{ result.overview }}</div>
        </div>
        <button class="series-tile__remove-button" @click="removeItemFromList('inProgress', result.id)">
          <Icon class="series-tile__remove-button-icon" name="trash"></Icon>
        </button>
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue'
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

// Computed properties for list total runtimes
const completedTotalRuntime = computed(() => {
  if (!completedData.value?.results) return 0
  return completedData.value.results.reduce((total, show) => total + calculateTotalRuntime(show), 0)
})

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

/**
 * Enrich a list of TV shows with additional details from v3
 * @param {Object} listData - The list of TV shows to enrich
 * @returns {Promise<Object>} A promise that resolves with the enriched list of TV shows
 *
 * Enriches each show with details from v3, and then fetches season details for each show.
 * The returned list will contain the original list items with two additional properties:
 * - `details`: The general details of the show from v3
 * - `seasonDetails`: An array of season details for the show from v3
 */
async function enrichWithDetails(listData) {
  if (!listData || !listData.results) return listData;

  // Fetch details from v3 for all items in parallel
  const detailsPromises = listData.results.map(item =>
      $fetch('/api/fetchDetails/tvSeriesDetails', {
        method: 'GET',
        query: {id: item.id}
      }).catch(err => {
        console.error(`Error fetching details for ${item.id}:`, err);
        return null; // Return null on error to avoid breaking the entire list
      })
  );

  const details = await Promise.all(detailsPromises);

  // Merge general details from v3 into original items
  listData.results = listData.results.map((item, index) => ({
    ...item,
    details: details[index]
  }));

  // Now fetch season details for each show
  const seasonDetailsPromises = listData.results.map(async (item) => {
    if (!item.details || !item.details.number_of_seasons) {
      return []; // No seasons to fetch
    }

    const numberOfSeasons = item.details.number_of_seasons;
    const seasonPromises = [];

    // Fetch details for each season (season numbers typically start from 1)
    for (let seasonNum = 1; seasonNum <= numberOfSeasons; seasonNum++) {
      seasonPromises.push(
          $fetch('/api/fetchDetails/tvSeasonDetails', {
            method: 'GET',
            query: {
              seriesId: item.id,
              seasonNumber: seasonNum
            }
          }).catch(err => {
            console.error(`Error fetching season ${seasonNum} for series ${item.id}:`, err);
            return null;
          })
      );
    }

    return await Promise.all(seasonPromises);
  });

  const allSeasonDetails = await Promise.all(seasonDetailsPromises);

  // Add season details to each show
  listData.results = listData.results.map((item, index) => ({
    ...item,
    seasonDetails: allSeasonDetails[index]
  }));

  return listData;
}

async function completedShowsData() {
  const data = await $fetch('/api/fetchLists/completedShows', {
    method: 'GET'
  });
  completedData.value = await enrichWithDetails(data);
  console.log(completedData.value, 'completed Data')
}

async function inProgressShowsData() {
  const data = await $fetch('/api/fetchLists/inProgressShows', {
    method: 'GET'
  });
  inProgressData.value = await enrichWithDetails(data);
}

async function watchListShowsData() {
  const data = await $fetch('/api/fetchLists/watchListShows', {
    method: 'GET'
  });
  watchListData.value = await enrichWithDetails(data);
}

async function droppedShowsData() {
  const data = await $fetch('/api/fetchLists/droppedShows', {
    method: 'GET'
  });
  droppedData.value = await enrichWithDetails(data);
}

/**
 * Calculate total runtime for a show by summing up all episode runtimes
 * @param {Object} show - The show object containing seasonDetails
 * @returns {number} Total runtime in minutes
 */
function calculateTotalRuntime(show) {
  if (!show || !show.seasonDetails || show.seasonDetails.length === 0) {
    return 0;
  }

  let totalMinutes = 0;

  // Iterate through all seasons
  for (const season of show.seasonDetails) {
    if (!season || !season.episodes) continue;

    // Iterate through all episodes in the season
    for (const episode of season.episodes) {
      if (episode && episode.runtime) {
        totalMinutes += episode.runtime;
      }
    }
  }

  return totalMinutes;
}

/**
 * Format runtime in minutes to days, hours and minutes
 * @param {number} minutes - Total runtime in minutes
 * @returns {string} Formatted string like "2d 5h 30m", "2h 30m" or "45m"
 */
function formatRuntime(minutes) {
  if (minutes === 0) return '0m';

  const totalHours = Math.floor(minutes / 60);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const remainingMinutes = minutes % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (remainingMinutes > 0) parts.push(`${remainingMinutes}m`);

  return parts.join(' ');
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

  &__summary {
    padding: 1rem 1.5rem;
    background-color: var(--blue);
    color: var(--grey);
    border-radius: 0.5rem;
    font-size: 1.1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 0.5rem;

    strong {
      font-weight: 600;
      margin-right: 0.5rem;
    }
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