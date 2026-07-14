<template>
  <div class="tile-container__sort">
    <Icon name="grid" class="tile-container__switch-view-button"
          @click="switchToGridMode()"></Icon>
    <Icon name="tv" class="tile-container__switch-view-button"
          @click="switchToListMode()"></Icon>
    <Icon name="list" class="tile-container__switch-view-button"
          @click="switchToShortMode()"></Icon>
    <Select :options="availableStatus" v-model="selectedStatus" id="select-status" name="status"></Select>
    <Select :options="availableGenres" v-model="selectedGenre" id="select-genre" name="genre"></Select>
  </div>
  <ListTile v-if="viewMode === 'list'"
            :active-data="filteredData"
            :active-list-type="activeListType"
            :calculate-total-runtime="calculateTotalRuntime"
            :completed="completed"
            :completed-total-runtime="completedTotalRuntime"
            :dropped="dropped"
            :format-runtime="formatRuntime"
            :image-url="imageUrl"
            :in-progress="inProgress"
            :watch-list="watchList"
            :is-loading="isLoading"
            :move-show-to-completed-list="moveShowToCompletedList"
            :move-show-to-dropped-list="moveShowToDroppedList"
            :move-show-to-in-progress-list="moveShowToInProgressList"
            :remove-item-from-list="removeItemFromList"
            :current-page="currentPage"
            :total-results="activeData?.total_results || 0"
            @page-change="handlePageChange"
  >
  </ListTile>
  <ShortTile v-if="viewMode === 'short'"
             :active-data="filteredData"
             :active-list-type="activeListType"
             :calculate-total-runtime="calculateTotalRuntime"
             :completed="completed"
             :completed-total-runtime="completedTotalRuntime"
             :dropped="dropped"
             :format-runtime="formatRuntime"
             :image-url="imageUrl"
             :in-progress="inProgress"
             :watch-list="watchList"
             :is-loading="isLoading"
             :move-show-to-completed-list="moveShowToCompletedList"
             :move-show-to-dropped-list="moveShowToDroppedList"
             :move-show-to-in-progress-list="moveShowToInProgressList"
             :remove-item-from-list="removeItemFromList"
             :current-page="currentPage"
             :total-results="activeData?.total_results || 0"
             @page-change="handlePageChange"
  >

  </ShortTile>
  <CardTile v-if="viewMode === 'card'"
            :active-data="filteredData"
            :active-list-type="activeListType"
            :calculate-total-runtime="calculateTotalRuntime"
            :completed="completed"
            :completed-total-runtime="completedTotalRuntime"
            :dropped="dropped"
            :format-runtime="formatRuntime"
            :image-url="imageUrl"
            :in-progress="inProgress"
            :watch-list="watchList"
            :is-loading="isLoading"
            :move-show-to-completed-list="moveShowToCompletedList"
            :move-show-to-dropped-list="moveShowToDroppedList"
            :move-show-to-in-progress-list="moveShowToInProgressList"
            :remove-item-from-list="removeItemFromList"
            :current-page="currentPage"
            :total-results="activeData?.total_results || 0"
            @page-change="handlePageChange"
  >
  </CardTile>
</template>

<script lang="ts" setup>
import CardTile from '../presentational/cardTile.vue'
import ListTile from '../presentational/listTile.vue'
import ShortTile from '../presentational/shortTile.vue'
import Select from '~/vue components/reusable/select.vue'
import {computed, onMounted, ref} from 'vue'
import {useShowCache} from '~/composables/useShowCache.js'
import Icon from '~/vue components/icons/Icon.vue'

interface Genre {
  id: number;
  name: string;
}

interface ShowDetails {
  genres?: Genre[];
  status?: string;
  number_of_seasons?: number;
}

interface Episode {
  runtime?: number;
}

interface Season {
  episodes?: Episode[];
}

interface Show {
  id: number;
  details?: ShowDetails;
  seasonDetails?: Season[];
}

interface ListData {
  results: Show[];
  total_results?: number;
}

const emit = defineEmits(['item-added'])
const viewMode = ref<'list' | 'card' | 'short'>('list')

const props = defineProps({
  completed: {
    type: Boolean,
    default: false
  },

  watchList: {
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

const completedData = ref<ListData | null>(null)
const droppedData = ref<ListData | null>(null)
const watchListData = ref<ListData | null>(null)
const inProgressData = ref<ListData | null>(null)
const isLoading = ref(false)
const imageUrl = ref('https://media.themoviedb.org/t/p/w220_and_h330_face')
const selectedGenre = ref('')
const selectedStatus = ref('')
const {getShowDetails, getSeasonDetails, invalidateShow} = useShowCache()

// Pagination state
const completedCurrentPage = ref(1)
const droppedCurrentPage = ref(1)
const watchListCurrentPage = ref(1)
const inProgressCurrentPage = ref(1)


function switchToListMode() {
  viewMode.value = 'list'
}

function switchToGridMode() {
  viewMode.value = 'card'
}

function switchToShortMode() {
  viewMode.value = 'short'
}

const availableGenres = computed(() => {
  if (!activeData.value?.results) return [{value: '', label: 'All Genres'}]

  const genreSet = new Set()
  activeData.value.results.forEach(show => {
    if (show.details?.genres) {
      show.details.genres.forEach(genre => {
        genreSet.add(genre.name)
      })
    }
  })

  const genres = Array.from(genreSet).sort()
  return [{value: '', label: 'All Genres'}, ...genres.map(genre => ({value: genre, label: genre}))]
})

const availableStatus = computed(() => {
  if (!activeData.value?.results) return [{value: '', label: 'All Status'}]

  const statusSet = new Set()
  activeData.value.results.forEach(show => {
    if (show.details?.status) {
      statusSet.add(show.details.status)
    }
  })

  const statuses = Array.from(statusSet).sort()
  return [{value: '', label: 'All Status'}, ...statuses.map(status => ({value: status, label: status}))]
})

const filteredData = computed<ListData | null>(() => {
  if (!activeData.value) return activeData.value

  const filtered = {
    ...activeData.value,
    results: activeData.value.results.filter(show => {
      const genreMatch = !selectedGenre.value || (show.details?.genres?.some(genre => genre.name === selectedGenre.value))
      const statusMatch = !selectedStatus.value || show.details?.status === selectedStatus.value
      return genreMatch && statusMatch
    })
  }

  return filtered
})

// Computed properties for list total runtimes
const completedTotalRuntime = computed<number>(() => {
  if (!completedData.value?.results) return 0
  return completedData.value.results.reduce((total, show) => total + calculateTotalRuntime(show), 0)
})

// Computed property to determine which list is active
const activeListType = computed<string | null>(() => {
  if (props.watchList) return 'watchList'
  if (props.inProgress) return 'inProgress'
  if (props.completed) return 'completed'
  if (props.dropped) return 'dropped'
  return null
})

// Computed property for current page based on active list
const currentPage = computed<number>(() => {
  switch (activeListType.value) {
    case 'watchList':
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
const activeData = computed<ListData | null>(() => {
  switch (activeListType.value) {
    case 'watchList':
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

async function removeItemFromList(listType: string, mediaId: string): Promise<void> {
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

    invalidateShow(mediaId);

    switch (listType) {
      case 'watchList':
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

async function addToList(listType: string, mediaId: string): Promise<void> {
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
    invalidateShow(mediaId);
    emit('item-added');
  } catch (error) {
    console.error(`Error adding to ${listType}:`, error);
  }
}

async function moveShowToCompletedList(mediaId: string): Promise<void> {
  if (activeListType.value === 'inProgress') {
    await removeItemFromList('inProgress', mediaId);
  }
  if (activeListType.value === 'watchList') {
    await removeItemFromList('watchList', mediaId);
  }
  await addToList('completed', mediaId);

}

async function moveShowToDroppedList(mediaId: string): Promise<void> {
  await removeItemFromList('inProgress', mediaId);
  await addToList('dropped', mediaId);
}

async function moveShowToInProgressList(mediaId: string): Promise<void> {
  if (activeListType.value === 'dropped') {
    await removeItemFromList('dropped', mediaId);
  }
  if (activeListType.value === 'watchList') {
    await removeItemFromList('watchList', mediaId);
  }
  await removeItemFromList('completed', mediaId);
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
async function enrichWithDetails(listData: ListData): Promise<ListData> {
  if (!listData || !listData.results) return listData;

  const detailsPromises = listData.results.map(item =>
      getShowDetails(item.id).catch(err => {
        console.error(`Error fetching details for ${item.id}:`, err);
        return null;
      })
  );

  const details = await Promise.all(detailsPromises);

  listData.results = listData.results.map((item, index) => ({
    ...item,
    details: details[index]
  }));

  const seasonDetailsPromises = listData.results.map(async (item) => {
    if (!item.details || !item.details.number_of_seasons) {
      return [];
    }

    const numberOfSeasons = item.details.number_of_seasons;
    const seasonPromises = [];

    for (let seasonNum = 1; seasonNum <= numberOfSeasons; seasonNum++) {
      seasonPromises.push(
          getSeasonDetails(item.id, seasonNum).catch(err => {
            console.error(`Error fetching season ${seasonNum} for series ${item.id}:`, err);
            return null;
          })
      );
    }

    return await Promise.all(seasonPromises);
  });

  const allSeasonDetails = await Promise.all(seasonDetailsPromises);

  listData.results = listData.results.map((item, index) => ({
    ...item,
    seasonDetails: allSeasonDetails[index]
  }));

  return listData;
}

async function completedShowsData(page = completedCurrentPage.value): Promise<void> {
  isLoading.value = true;
  try {
    const data = await $fetch('/api/fetchLists/completedShows', {
      method: 'GET',
      query: {page}
    });
    completedData.value = await enrichWithDetails(data);
    // Clear toggle button tracking when data changes
  } finally {
    isLoading.value = false;
  }
}

async function inProgressShowsData(page = inProgressCurrentPage.value): Promise<void> {
  isLoading.value = true;
  try {
    const data = await $fetch('/api/fetchLists/inProgressShows', {
      method: 'GET',
      query: {page}
    });
    inProgressData.value = await enrichWithDetails(data);
    console.log(inProgressData.value, 'in progress data')

  } finally {
    isLoading.value = false;
  }
}

async function watchListShowsData(page = watchListCurrentPage.value): Promise<void> {
  isLoading.value = true;
  try {
    const data = await $fetch('/api/fetchLists/watchListShows', {
      method: 'GET',
      query: {page}
    });
    watchListData.value = await enrichWithDetails(data);
    console.log(watchListData.value, 'watchlist data')
  } finally {
    isLoading.value = false;
  }
}

async function droppedShowsData(page = droppedCurrentPage.value): Promise<void> {
  isLoading.value = true;
  try {
    const data = await $fetch('/api/fetchLists/droppedShows', {
      method: 'GET',
      query: {page}
    });
    droppedData.value = await enrichWithDetails(data);
  } finally {
    isLoading.value = false;
  }
}

/**
 * Calculate total runtime for a show by summing up all episode runtimes
 * @param {Object} show - The show object containing seasonDetails
 * @returns {number} Total runtime in minutes
 */
function calculateTotalRuntime(show: Show): number {
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
function formatRuntime(minutes: number): string {
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
function handleCompletedPageChange(newPage: number): void {
  completedCurrentPage.value = newPage
  completedShowsData(newPage)
}

function handleInProgressPageChange(newPage: number): void {
  inProgressCurrentPage.value = newPage
  inProgressShowsData(newPage)
}

function handleWatchListPageChange(newPage: number): void {
  watchListCurrentPage.value = newPage
  watchListShowsData(newPage)
}

function handleDroppedPageChange(newPage: number): void {
  droppedCurrentPage.value = newPage
  droppedShowsData(newPage)
}

// Unified page change handler that delegates to the appropriate list handler
function handlePageChange(newPage: number): void {
  switch (activeListType.value) {
    case 'watchList':
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

onMounted(() => {
  if (props.completed) {
    completedShowsData()
  } else if (props.dropped) {
    droppedShowsData()
  } else if (props.watchList) {
    watchListShowsData()
  } else if (props.inProgress) {
    inProgressShowsData()
  }
})

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

</script>

<style lang="less" scoped>
.tile-container__sort {
  display: flex;
  justify-content: end;
  align-items: center;
  margin-bottom: 1rem;
  margin-top: 1rem;
  padding: 0.25rem;
  gap: 0.75rem;
}

.tile-container__sort-select {
  padding: 0.375rem 0.625rem;
  border-radius: 0.375rem;
  background-color: var(--surface);
  color: var(--text-primary);
  border: 1px solid var(--border-moderate);
  font-size: 0.8125rem;
  cursor: pointer;
  transition: border-color var(--transition-fast),
  background-color var(--transition-fast);

  &:hover {
    border-color: var(--accent);
  }

  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
}

.tile-container__switch-view-button {
  font-size: 0.8125rem;
}
</style>

