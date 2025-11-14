<template>
  <div v-show="watch">
    <div v-if="isLoadingWatchList && watchListData.results.length === 0" class="series-tile__loading-container">
      <Loading/>
    </div>
    <div v-if="watchListData.results.length > 0" class="series-tile__wrapper">
      <div v-for="result in watchListData.results" :key="result.id" class="series-tile">
        <div class="series-tile__image-wrapper">
          <div class="series-tile__image">
            <img :alt="'Bild der Serie ' + result.original_name" :src="imageUrl + result.poster_path"
                 class="series-tile__img">
          </div>
        </div>
        <div class="series-tile__info-wrapper">
          <div class="series-tile__title">
            {{ result.original_name }}
            <span v-if="result.details?.first_air_date">({{ result.details.first_air_date.split('-')[0] }})</span>
          </div>
          <div v-if="result.details">{{ result.details.number_of_seasons }} {{ $t('seasons') }} /
            {{ result.details.number_of_episodes }} {{ $t('episodes') }}
          </div>
          <div v-if="calculateTotalRuntime(result) > 0" class="series-tile__runtime">
            Total Runtime: {{ formatRuntime(calculateTotalRuntime(result)) }}
          </div>
          <br>
          <div class="series-tile__description-wrapper">
            <div v-show="isExpanded(result.id)" class="series-tile__description-more">{{ result.overview }}</div>
            <div v-show="!isExpanded(result.id)" :ref="el => setDescriptionRef(el, result.id)"
                 class="series-tile__description-less">{{ result.overview }}
            </div>
            <action-button v-if="needsToggleButton(result.id) || isExpanded(result.id)"
                           :buttonName="toggleCtaLabel(result.id)"
                           primary @click="toggleExpanded(result.id)"></action-button>
          </div>
        </div>
        <div class="series-tile__status">
          {{ result.details?.status }}
        </div>
        <button class="series-tile__remove-button" @click="removeItemFromList('watchlist', result.id)">
          <Icon class="series-tile__remove-button-icon" name="trash"></Icon>
        </button>
      </div>
    </div>
    <div v-if="watchListData.results.length > 0 && watchListData.page < watchListData.total_pages"
         class="series-tile__load-more">
      <action-button :buttonName="isLoadingWatchList ? 'Loading...' : 'Load More'"
                     :disabled="isLoadingWatchList"
                     @click="watchListShowsData(false)"></action-button>
    </div>
  </div>

  <div v-show="inProgress">
    <div v-if="isLoadingInProgress && inProgressData.results.length === 0" class="series-tile__loading-container">
      <Loading/>
    </div>
    <div v-if="inProgressData.results.length > 0" class="series-tile__wrapper">
      <div v-for="result in inProgressData.results" :key="result.id" class="series-tile">
        <div class="series-tile__image-wrapper">
          <div class="series-tile__image">
            <img :alt="'Bild der Serie ' + result.original_name" :src="imageUrl + result.poster_path"
                 class="series-tile__img">
          </div>
        </div>
        <div class="series-tile__info-wrapper">
          <div class="series-tile__title">
            {{ result.original_name }}
            <span v-if="result.details?.first_air_date">({{ result.details.first_air_date.split('-')[0] }})</span>
          </div>
          <div v-if="result.details">{{ result.details.number_of_seasons }} {{ $t('seasons') }} /
            {{ result.details.number_of_episodes }} {{ $t('episodes') }}
          </div>
          <div class="series-tile__runtime">
            Total Runtime: {{ formatRuntime(calculateTotalRuntime(result)) }}
          </div>
          <br>
          <div class="series-tile__description-wrapper">
            <div v-show="isExpanded(result.id)" class="series-tile__description-more">{{ result.overview }}</div>
            <div v-show="!isExpanded(result.id)" :ref="el => setDescriptionRef(el, result.id)"
                 class="series-tile__description-less">{{ result.overview }}
            </div>
            <action-button v-if="needsToggleButton(result.id) || isExpanded(result.id)"
                           :buttonName="toggleCtaLabel(result.id)"
                           primary @click="toggleExpanded(result.id)"></action-button>
          </div>
        </div>
        <div class="series-tile__status">
          {{ result.details?.status }}
        </div>
        <div class="series-tile__action-buttons">
          <div class="series-tile__remove-button-wrapper">
            <button class="series-tile__remove-button" @click="removeItemFromList('inProgress', result.id)">
              <Icon class="series-tile__remove-button-icon" name="trash"></Icon>
            </button>
          </div>
          <div class="series-tile__move-buttons">
            <button class="series-tile__move-to-completed" @click="moveShowToCompletedList(result.id)">
              <Icon name="check_circle"></Icon>
            </button>
            <button class="series-tile__move-to-dropped" @click="moveShowToDroppedList(result.id)">
              <Icon name="cancel"></Icon>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="inProgressData.results.length > 0 && inProgressData.page < inProgressData.total_pages"
         class="series-tile__load-more">
      <action-button :buttonName="isLoadingInProgress ? 'Loading...' : 'Load More'"
                     :disabled="isLoadingInProgress"
                     @click="inProgressShowsData(false)"></action-button>
    </div>
  </div>

  <div v-show="completed">
    <div v-if="isLoadingCompleted && completedData.results.length === 0" class="series-tile__loading-container">
      <Loading/>
    </div>
    <div v-if="completedData.results.length > 0" class="series-tile__wrapper">
      <div v-if="completedTotalRuntime > 0" class="series-tile__summary">
        <strong>Total Runtime:</strong> {{ formatRuntime(completedTotalRuntime) }} ({{ completedData.total_results }}
        shows)
      </div>
      <div v-for="result in completedData.results"
           :key="result.id"
           :class="{'series-tile':!isExpanded(result.id),'series-tile--expanded':isExpanded(result.id)}">
        <div class="series-tile__image-wrapper">
          <div class="series-tile__image">
            <img :alt="'Bild der Serie ' + result.original_name" :src="imageUrl + result.poster_path"
                 class="series-tile__img">
          </div>
        </div>
        <div class="series-tile__info-wrapper">
          <div class="series-tile__title">
            {{ result.original_name }}
            <span v-if="result.details?.first_air_date">({{ result.details.first_air_date.split('-')[0] }})</span>
          </div>
          <div v-if="result.details">{{ result.details.number_of_seasons }} {{ $t('seasons') }} /
            {{ result.details.number_of_episodes }} {{ $t('episodes') }}
          </div>
          <br>
          <div class="series-tile__description-wrapper">
            <div v-show="isExpanded(result.id)" class="series-tile__description-more">{{ result.overview }}</div>
            <div v-show="!isExpanded(result.id)" :ref="el => setDescriptionRef(el, result.id)"
                 class="series-tile__description-less">{{ result.overview }}
            </div>
            <action-button v-if="needsToggleButton(result.id) || isExpanded(result.id)"
                           :buttonName="toggleCtaLabel(result.id)"
                           primary @click="toggleExpanded(result.id)"></action-button>
          </div>
        </div>
        <div class="series-tile__status">
          {{ result.details?.status }}
        </div>
        <div class="series-tile__action-buttons">
          <div class="series-tile__remove-button-wrapper">
            <button class="series-tile__remove-button" @click="removeItemFromList('completed', result.id)">
              <Icon class="series-tile__remove-button-icon" name="trash"></Icon>
            </button>
          </div>
          <div class="series-tile__move-buttons">
            <button class="series-tile__move-to-inProgress" @click="moveShowToInProgressList(result.id)">
              <Icon name="play_circle"></Icon>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="completedData.results.length > 0 && completedData.page < completedData.total_pages"
         class="series-tile__load-more">
      <action-button :buttonName="isLoadingCompleted ? 'Loading...' : 'Load More'"
                     :disabled="isLoadingCompleted"
                     @click="completedShowsData(false)"></action-button>
    </div>
  </div>

  <div v-show="dropped">
    <div v-if="isLoadingDropped && droppedData.results.length === 0" class="series-tile__loading-container">
      <Loading/>
    </div>
    <div v-if="droppedData.results.length > 0" class="series-tile__wrapper">
      <div v-for="result in droppedData.results" :key="result.id" class="series-tile">
        <div class="series-tile__image-wrapper">
          <div class="series-tile__image">
            <img :alt="'Bild der Serie ' + result.original_name" :src="imageUrl + result.poster_path"
                 class="series-tile__img">
          </div>
        </div>
        <div class="series-tile__info-wrapper">
          <div class="series-tile__title">
            {{ result.original_name }}
            <span v-if="result.details?.first_air_date">({{ result.details.first_air_date.split('-')[0] }})</span>
          </div>
          <div v-if="calculateTotalRuntime(result) > 0" class="series-tile__runtime">
            Total Runtime: {{ formatRuntime(calculateTotalRuntime(result)) }}
          </div>
        </div>
        <button class="series-tile__remove-button" @click="removeItemFromList('dropped', result.id)">
          <Icon class="series-tile__remove-button-icon" name="trash"></Icon>
        </button>
      </div>
    </div>
    <div v-if="droppedData.results.length > 0 && droppedData.page < droppedData.total_pages"
         class="series-tile__load-more">
      <action-button :buttonName="isLoadingDropped ? 'Loading...' : 'Load More'"
                     :disabled="isLoadingDropped"
                     @click="droppedShowsData(false)"></action-button>
    </div>
  </div>

</template>

<script lang="ts" setup>
import {computed, nextTick, onMounted, ref} from 'vue'
import Icon from '~/vue components/icons/Icon.vue'
import ActionButton from "~/vue components/buttons/actionButton.vue";
import Loading from "~/vue components/loading.vue";

const props = defineProps({
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
const {t, locale} = useI18n()

console.log('Current locale:', locale.value)
console.log('Seasons translation:', t('seasons'))

const completedData = ref({results: [], total_pages: 0, total_results: 0, page: 0})
const droppedData = ref({results: [], total_pages: 0, total_results: 0, page: 0})
const watchListData = ref({results: [], total_pages: 0, total_results: 0, page: 0})
const inProgressData = ref({results: [], total_pages: 0, total_results: 0, page: 0})
const isLoadingCompleted = ref(false)
const isLoadingDropped = ref(false)
const isLoadingWatchList = ref(false)
const isLoadingInProgress = ref(false)
const expandedItems = ref(new Set())
const itemsNeedingToggle = ref(new Set())
const imageUrl = ref('https://media.themoviedb.org/t/p/w220_and_h330_face')

const isExpanded = (id) => expandedItems.value.has(id)
const toggleExpanded = (id) => {
  if (expandedItems.value.has(id)) {
    expandedItems.value.delete(id)
  } else {
    expandedItems.value.add(id)
  }
}
const toggleCtaLabel = (id) => isExpanded(id) ? 'Show Less' : 'Show More'
const needsToggleButton = (id) => itemsNeedingToggle.value.has(id)

// Function to track if the description needs a toggle button (more than 3 lines of text)
const setDescriptionRef = (el, id) => {
  if (el) {
    nextTick(() => {
      // Check if the content overflows (scrollHeight > clientHeight means text is clamped)
      if (el.scrollHeight > el.clientHeight) {
        itemsNeedingToggle.value.add(id)
      } else {
        itemsNeedingToggle.value.delete(id)
      }
    })
  }
}

// Computed property for total runtime (from backend)
const completedTotalRuntime = computed(() => {
  return completedData.value?.total_runtime || 0
})

onMounted(() => {
  // Only fetch data for the active list based on props
  if (props.completed) {
    completedShowsData()
  }
  if (props.dropped) {
    droppedShowsData()
  }
  if (props.watch) {
    watchListShowsData()
  }
  if (props.inProgress) {
    inProgressShowsData()
  }
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

    // Refresh the appropriate list after successful removal (reset to page 1)
    switch (listType) {
      case 'watchlist':
        await watchListShowsData(true);
        break;
      case 'completed':
        await completedShowsData(true);
        break;
      case 'dropped':
        await droppedShowsData(true);
        break;
      case 'inProgress':
        await inProgressShowsData(true);
        break;
    }
  } catch (error) {
    console.error(`Error removing from ${listType}:`, error);
  }
}

async function addToList(mediaId, listType) {
  const accessToken = localStorage.getItem('tmdb_access_token');

  if (!accessToken) {
    console.error('No access token found. Please authenticate first.');
    return;
  }

  try {
    const response = await $fetch('/api/listActions/addItemsToList', {
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
    console.log(`Successfully added to ${listType}:`, response);

    // Refresh the destination list after successful add (reset to page 1)
    switch (listType) {
      case 'watchlist':
        await watchListShowsData(true);
        break;
      case 'completed':
        await completedShowsData(true);
        break;
      case 'dropped':
        await droppedShowsData(true);
        break;
      case 'inProgress':
        await inProgressShowsData(true);
        break;
    }
  } catch (error) {
    console.error(`Error adding to ${listType}:`, error);
  }
}

async function moveShowToCompletedList(mediaId) {
  await removeItemFromList('inProgress', mediaId);
  await addToList(mediaId, 'completed');

}

async function moveShowToDroppedList(mediaId) {
  await removeItemFromList('inProgress', mediaId);
  await addToList(mediaId, 'dropped');
}

async function moveShowToInProgressList(mediaId) {
  await removeItemFromList('completed', mediaId);
  await addToList(mediaId, 'inProgress');
}

async function completedShowsData(reset = false) {
  if (isLoadingCompleted.value) return;

  const nextPage = reset ? 1 : (completedData.value.page || 0) + 1;

  // Don't fetch if we've already loaded all pages
  if (!reset && completedData.value.total_pages && nextPage > completedData.value.total_pages) {
    return;
  }

  isLoadingCompleted.value = true;
  try {
    const data = await $fetch(`/api/fetchLists/completedShows?page=${nextPage}`);

    if (reset) {
      completedData.value = data;
    } else {
      // Append new results to existing ones, preserve total_runtime from first page
      completedData.value = {
        ...data,
        results: [...(completedData.value.results || []), ...(data.results || [])],
        total_runtime: completedData.value.total_runtime || data.total_runtime
      };
    }

    itemsNeedingToggle.value.clear();
  } catch (error) {
    console.error('Error fetching completed shows:', error);
  } finally {
    isLoadingCompleted.value = false;
  }
}

async function inProgressShowsData(reset = false) {
  if (isLoadingInProgress.value) return;

  const nextPage = reset ? 1 : (inProgressData.value.page || 0) + 1;

  if (!reset && inProgressData.value.total_pages && nextPage > inProgressData.value.total_pages) {
    return;
  }

  isLoadingInProgress.value = true;
  try {
    const data = await $fetch(`/api/fetchLists/inProgressShows?page=${nextPage}`);

    if (reset) {
      inProgressData.value = data;
    } else {
      inProgressData.value = {
        ...data,
        results: [...(inProgressData.value.results || []), ...(data.results || [])]
      };
    }

    itemsNeedingToggle.value.clear();
  } catch (error) {
    console.error('Error fetching in-progress shows:', error);
  } finally {
    isLoadingInProgress.value = false;
  }
}

async function watchListShowsData(reset = false) {
  if (isLoadingWatchList.value) return;

  const nextPage = reset ? 1 : (watchListData.value.page || 0) + 1;

  if (!reset && watchListData.value.total_pages && nextPage > watchListData.value.total_pages) {
    return;
  }

  isLoadingWatchList.value = true;
  try {
    const data = await $fetch(`/api/fetchLists/watchListShows?page=${nextPage}`);

    if (reset) {
      watchListData.value = data;
    } else {
      watchListData.value = {
        ...data,
        results: [...(watchListData.value.results || []), ...(data.results || [])]
      };
    }

    itemsNeedingToggle.value.clear();
  } catch (error) {
    console.error('Error fetching watchlist shows:', error);
  } finally {
    isLoadingWatchList.value = false;
  }
}

async function droppedShowsData(reset = false) {
  if (isLoadingDropped.value) return;

  const nextPage = reset ? 1 : (droppedData.value.page || 0) + 1;

  if (!reset && droppedData.value.total_pages && nextPage > droppedData.value.total_pages) {
    return;
  }

  isLoadingDropped.value = true;
  try {
    const data = await $fetch(`/api/fetchLists/droppedShows?page=${nextPage}`);

    if (reset) {
      droppedData.value = data;
    } else {
      droppedData.value = {
        ...data,
        results: [...(droppedData.value.results || []), ...(data.results || [])]
      };
    }

    itemsNeedingToggle.value.clear();
  } catch (error) {
    console.error('Error fetching dropped shows:', error);
  } finally {
    isLoadingDropped.value = false;
  }
}

//calculate total runtime for a single show
function calculateTotalRuntime(show) {
  if (!show || !show.details) {
    return 0;
  }

  const details = show.details;
  if (details.episode_run_time && details.episode_run_time.length > 0 && details.number_of_episodes) {
    // Use the first (most common) episode runtime or calculate average
    const avgRuntime = details.episode_run_time.length > 1
        ? details.episode_run_time.reduce((a: number, b: number) => a + b, 0) / details.episode_run_time.length
        : details.episode_run_time[0];

    return Math.round(avgRuntime * details.number_of_episodes);
  }

  return 0;
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
  height: 13rem;
  box-shadow: var(--tile-box-shadow);
  background-color: var(--tile-color);
  border-radius: .5rem;
  border: 1px solid var(--black);
  gap: 2rem;

  &--expanded {
    display: flex;
    height: max-content;
    box-shadow: var(--tile-box-shadow);
    background-color: var(--tile-color);
    border-radius: .5rem;
    border: 1px solid var(--border-color);
    gap: 2rem;
  }

  &__title {
    font-weight: bold;
  }

  &__description-wrapper button {
    margin-top: .4rem;
    font-weight: bold;
    background: var(--beige);
    font-size: 12px;
    height: 2.2rem;
  }

  &__description-less {
    height: max-content;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  &__description-more {
    height: max-content;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 9;
    -webkit-box-orient: vertical;
  }

  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__summary {
    padding: 1rem 1.5rem;
    background-color: var(--beige);
    color: var(--text-secondary);
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
    flex-basis: 80%;
    padding: 1rem;
  }

  &__image-wrapper {
    flex-basis: 10%;
    align-content: center;
    margin-left: 1rem;
  }

  &__action-buttons {
    display: flex;
    gap: 0.5rem;
    flex-direction: column;
    justify-content: space-between;
  }

  &__remove-button {
    height: 4rem;
    border: none;
    background: none;

    &-wrapper {
      display: flex;
      justify-content: end;
      margin: 0 1rem 1rem 0;
    }
  }

  &__move-buttons {
    display: flex;
    gap: .8rem;
    margin: 0 1rem 1rem 0;

    button {
      display: flex;
      background: var(--button-secondary, #fff);
      border: 1px solid var(--grey, #ccc);
      border-radius: .5rem;
      height: 3rem;

      :hover {
        cursor: pointer;
      }
    }

    svg path:not([fill="none"]) {
      fill: var(--button-primary);
    }
  }

  &__remove-button-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    cursor: pointer;


    &:hover {
      opacity: 1;
    }

    svg {
      fill: var(--error-red);
    }
  }

  &__img {
    height: 10rem;
    border-radius: .5rem;
  }

  &__status {
    display: flex;
    flex-basis: 10%;
    padding: 1rem;
    font-weight: bold;
  }

  &__loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 20rem;
    width: 100%;
  }

  &__load-more {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem 0;
    width: 100%;
  }
}
</style>