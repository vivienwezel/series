<template>
  <div class="tile-container__sort">
    <ActionButton button-name="Switch View" class="tile-container__switch-view-button" primary
                  @click="switchView"></ActionButton>
    <select id="sort" class="tile-container__sort-select" name="sort">
      <option value="1">Sort</option>
      <option value="2">Sort by Name</option>
      <option value="3">Sort by Date</option>
    </select>
  </div>
  <ListTile v-show="toggleView"
            :active-data="activeData"
            :active-list-type="activeListType"
            :calculate-total-runtime="calculateTotalRuntime"
            :completed="completed"
            :completed-total-runtime="completedTotalRuntime"
            :dropped="dropped"
            :format-runtime="formatRuntime"
            :image-url="imageUrl"
            :in-progress="inProgress"
            :is-expanded="isExpanded"
            :is-loading="isLoading"
            :move-show-to-completed-list="moveShowToCompletedList"
            :move-show-to-dropped-list="moveShowToDroppedList"
            :move-show-to-in-progress-list="moveShowToInProgressList"
            :needs-toggle-button="needsToggleButton"
            :remove-item-from-list="removeItemFromList"
            :set-description-ref="setDescriptionRef"
            :toggle-cta-label="toggleCtaLabel"
            :toggle-expanded="toggleExpanded"
            :watch="watch"
            :current-page="currentPage"
            :total-results="activeData?.total_results || 0"
            @page-change="handlePageChange"
  >
  </ListTile>
  <CardTile v-show="!toggleView"
            :active-data="activeData"
            :active-list-type="activeListType"
            :calculate-total-runtime="calculateTotalRuntime"
            :completed="completed"
            :completed-total-runtime="completedTotalRuntime"
            :dropped="dropped"
            :format-runtime="formatRuntime"
            :image-url="imageUrl"
            :in-progress="inProgress"
            :is-expanded="isExpanded"
            :is-loading="isLoading"
            :move-show-to-completed-list="moveShowToCompletedList"
            :move-show-to-dropped-list="moveShowToDroppedList"
            :move-show-to-in-progress-list="moveShowToInProgressList"
            :needs-toggle-button="needsToggleButton"
            :remove-item-from-list="removeItemFromList"
            :set-description-ref="setDescriptionRef"
            :toggle-cta-label="toggleCtaLabel"
            :toggle-expanded="toggleExpanded"
            :watch="watch"
            :current-page="currentPage"
            :total-results="activeData?.total_results || 0"
            @page-change="handlePageChange"
  >
  </CardTile>
</template>

<script lang="ts" setup>
import CardTile from '../presentational/cardTile.vue'
import ListTile from '../presentational/listTile.vue'
import ActionButton from '~/vue components/buttons/actionButton.vue'
import {computed, nextTick, onMounted, ref} from 'vue'

const toggleView = ref(true)

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

const completedData = ref(null)
const droppedData = ref(null)
const watchListData = ref(null)
const inProgressData = ref(null)
const isLoading = ref(false)
const expandedItems = ref(new Set())
const itemsNeedingToggle = ref(new Set())
const imageUrl = ref('https://media.themoviedb.org/t/p/w220_and_h330_face')

// Pagination state
const completedCurrentPage = ref(1)
const droppedCurrentPage = ref(1)
const watchListCurrentPage = ref(1)
const inProgressCurrentPage = ref(1)

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

// Computed properties for list total runtimes
const completedTotalRuntime = computed(() => {
  if (!completedData.value?.results) return 0
  return completedData.value.results.reduce((total, show) => total + calculateTotalRuntime(show), 0)
})

// Computed property to determine which list is active
const activeListType = computed(() => {
  if (props.watch) return 'watchlist'
  if (props.inProgress) return 'inProgress'
  if (props.completed) return 'completed'
  if (props.dropped) return 'dropped'
  return null
})

// Computed property for current page based on active list
const currentPage = computed(() => {
  switch (activeListType.value) {
    case 'watchlist':
      return watchListCurrentPage.value
    case 'inProgress':
      return inProgressCurrentPage.value
    case 'completed':
      return completedCurrentPage.value
    case 'dropped':
      return droppedCurrentPage.value
    default:
      return 1
  }
})

// Computed property to get the active data source
const activeData = computed(() => {
  switch (activeListType.value) {
    case 'watchlist':
      return watchListData.value
    case 'inProgress':
      return inProgressData.value
    case 'completed':
      return completedData.value
    case 'dropped':
      return droppedData.value
    default:
      return null
  }
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
    this.$emit('item-added');
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

async function completedShowsData(page = completedCurrentPage.value) {
  isLoading.value = true;
  try {
    const data = await $fetch('/api/fetchLists/completedShows', {
      method: 'GET',
      query: { page }
    });
    completedData.value = await enrichWithDetails(data);
    console.log(completedData.value, 'completed Data')
    // Clear toggle button tracking when data changes
    itemsNeedingToggle.value.clear()
  } finally {
    isLoading.value = false;
  }
}

async function inProgressShowsData(page = inProgressCurrentPage.value) {
  isLoading.value = true;
  try {
    const data = await $fetch('/api/fetchLists/inProgressShows', {
      method: 'GET',
      query: { page }
    });
    inProgressData.value = await enrichWithDetails(data);
    itemsNeedingToggle.value.clear()
  } finally {
    isLoading.value = false;
  }
}

async function watchListShowsData(page = watchListCurrentPage.value) {
  isLoading.value = true;
  try {
    const data = await $fetch('/api/fetchLists/watchListShows', {
      method: 'GET',
      query: { page }
    });
    watchListData.value = await enrichWithDetails(data);
    itemsNeedingToggle.value.clear()
  } finally {
    isLoading.value = false;
  }
}

async function droppedShowsData(page = droppedCurrentPage.value) {
  isLoading.value = true;
  try {
    const data = await $fetch('/api/fetchLists/droppedShows', {
      method: 'GET',
      query: { page }
    });
    droppedData.value = await enrichWithDetails(data);
    itemsNeedingToggle.value.clear()
  } finally {
    isLoading.value = false;
  }
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


// Page change handlers
function handleCompletedPageChange(newPage) {
  completedCurrentPage.value = newPage
  completedShowsData(newPage)
}

function handleInProgressPageChange(newPage) {
  inProgressCurrentPage.value = newPage
  inProgressShowsData(newPage)
}

function handleWatchListPageChange(newPage) {
  watchListCurrentPage.value = newPage
  watchListShowsData(newPage)
}

function handleDroppedPageChange(newPage) {
  droppedCurrentPage.value = newPage
  droppedShowsData(newPage)
}

// Unified page change handler that delegates to the appropriate list handler
function handlePageChange(newPage) {
  switch (activeListType.value) {
    case 'watchlist':
      handleWatchListPageChange(newPage)
      break
    case 'inProgress':
      handleInProgressPageChange(newPage)
      break
    case 'completed':
      handleCompletedPageChange(newPage)
      break
    case 'dropped':
      handleDroppedPageChange(newPage)
      break
  }
}

// Expose methods so parent can trigger refresh
defineExpose({
  refreshWatchList: watchListShowsData,
  refreshCompleted: completedShowsData,
  refreshDropped: droppedShowsData,
  refreshOngoing: inProgressShowsData,
  completedCurrentPage,
  droppedCurrentPage,
  watchListCurrentPage,
  inProgressCurrentPage,
  handleCompletedPageChange,
  handleInProgressPageChange,
  handleWatchListPageChange,
  handleDroppedPageChange
})

function switchView() {
  toggleView.value = !toggleView.value
}

</script>

<style lang="less" scoped>
.tile-container__sort {
  display: flex;
  justify-content: end;
  margin-bottom: 1rem;
  margin-top: 1rem;
  padding: .3rem;
}

.tile-container__sort-select {
  margin-left: 1rem;
  padding-left: .3rem;
  border-radius: .4rem;
}
</style>

