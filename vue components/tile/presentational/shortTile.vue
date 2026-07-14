<script lang="ts" setup>
import Icon from '../../icons/Icon.vue'

interface Props {
  imageUrl: string;
  calculateTotalRuntime: Function;
  formatRuntime: Function;
  removeItemFromList: Function;
  moveShowToCompletedList: Function;
  moveShowToDroppedList: Function;
  moveShowToInProgressList: Function;
  completed?: boolean;
  dropped?: boolean;
  watchList?: boolean;
  inProgress?: boolean;
  completedData?: object | null;
  droppedData?: object | null;
  watchListData?: object | null;
  inProgressData?: object | null;
  isLoading?: boolean;
  activeListType?: string | null;
  activeData?: object | null;
  completedTotalRuntime?: number;
  currentPage?: number;
  totalResults?: number;
}

withDefaults(defineProps<Props>(), {
  completed: false,
  dropped: false,
  watchList: false,
  inProgress: false,
  completedData: null,
  droppedData: null,
  watchListData: null,
  inProgressData: null,
  isLoading: false,
  activeListType: null,
  activeData: null,
  completedTotalRuntime: 0,
  currentPage: 1,
  totalResults: 0,
})

</script>

<template>
  <div v-if="activeData" class="short-list-tile__wrapper">
    <div v-for="result in activeData?.results" :key="result.id">
      <div class="short-list-tile">
        <h3 class="short-list-tile__title">{{ result.name }} ({{
            result.details?.first_air_date.split('-')[0]
          }})</h3>
        <div class="short-list-tile__season-info">
          {{ result.details?.number_of_seasons }} Seasons / {{ result.details.number_of_episodes }} Episodes
        </div>
        <div class="short-list-tile__status">
          {{ result.details?.status }}
        </div>
        <div class="short-list-tile__genre">
          {{ result.details.genres.map(genre => genre.name).join(', ') }}
        </div>
        <div class="short-list-tile__remove-button">
          <button :aria-label="'Remove ' + result.name + ' from ' + activeListType"
                  class="short-list-tile__remove-button"
                  @click="removeItemFromList(activeListType, result.id)">
            <Icon aria-hidden="true" name="trash"></Icon>
          </button>
        </div>
        <div class="list-tile__move-buttons">
          <!-- InProgress: can move to completed or dropped -->
          <template v-if="activeListType === 'inProgress'">
            <button :aria-label="'Move ' + result.name + ' to completed list'"
                    class="list-tile__move-to-completed"
                    @click="moveShowToCompletedList(result.id)">
              <Icon aria-hidden="true" name="check_circle"></Icon>
            </button>
            <button :aria-label="'Move ' + result.name + ' to dropped list'"
                    class="list-tile__move-to-dropped"
                    @click="moveShowToDroppedList(result.id)">
              <Icon aria-hidden="true" name="cancel"></Icon>
            </button>
          </template>
          <!-- Completed: can move back to inProgress -->
          <template v-else-if="activeListType === 'completed'">
            <button :aria-label="'Move ' + result.name + ' back to in progress list'"
                    class="list-tile__move-to-inProgress"
                    @click="moveShowToInProgressList(result.id)">
              <Icon aria-hidden="true" name="play_circle"></Icon>
            </button>
          </template>
        </div>
      </div>


    </div>
  </div>

</template>

<style lang="less" scoped>
.short-list-tile {
  display: flex;
  flex-direction: row;
  background-color: #fff;

  &__title {

  }

  &__wrapper {
    display: flex;
    flex-direction: column;
  }
}

</style>