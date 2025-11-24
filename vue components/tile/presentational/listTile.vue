<script lang="ts" setup>
import Icon from "~/vue components/icons/Icon.vue";
import Loading from "~/vue components/loading.vue";
import ActionButton from "~/vue components/buttons/actionButton.vue";
import Pagination from "~/vue components/reusable/pagination.vue";

defineProps({
  completed: {
    type: Boolean,
    default: false
  },
  dropped: {
    type: Boolean,
    default: false
  },
  watch: {
    type: Boolean,
    default: false
  },
  inProgress: {
    type: Boolean,
    default: false
  },
  completedData: {
    type: Object,
    default: () => null
  },
  droppedData: {
    type: Object,
    default: () => null
  },
  watchListData: {
    type: Object,
    default: () => null
  },
  inProgressData: {
    type: Object,
    default: () => null
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  activeListType: {
    type: String,
    default: null
  },
  activeData: {
    type: Object,
    default: () => null
  },
  imageUrl: {
    type: String,
    required: true
  },
  isExpanded: {
    type: Function,
    required: true
  },
  toggleExpanded: {
    type: Function,
    required: true
  },
  toggleCtaLabel: {
    type: Function,
    required: true
  },
  needsToggleButton: {
    type: Function,
    required: true
  },
  setDescriptionRef: {
    type: Function,
    required: true
  },
  calculateTotalRuntime: {
    type: Function,
    required: true
  },
  formatRuntime: {
    type: Function,
    required: true
  },
  completedTotalRuntime: {
    type: Number,
    default: 0
  },
  removeItemFromList: {
    type: Function,
    required: true
  },
  moveShowToCompletedList: {
    type: Function,
    required: true
  },
  moveShowToDroppedList: {
    type: Function,
    required: true
  },
  moveShowToInProgressList: {
    type: Function,
    required: true
  },
  currentPage: {
    type: Number,
    default: 1
  },
  totalResults: {
    type: Number,
    default: 0
  }
})

defineEmits(['page-change'])
</script>

<template>
  <div v-if="isLoading" class="list-tile__loading-container">
    <Loading/>
  </div>
  <div v-else-if="activeData" class="list-tile__wrapper">
    <!-- Pagination at top -->
    <Pagination 
      :current-page="currentPage" 
      :total-results="totalResults"
      @page-change="$emit('page-change', $event)"
    />
    <!-- Summary header for completed list -->
    <div v-if="activeListType === 'completed' && completedTotalRuntime > 0" class="list-tile__summary">
      <strong>Total Runtime:</strong> {{ formatRuntime(completedTotalRuntime) }} ({{ activeData.total_results }} shows)
    </div>

    <!-- Main tile loop -->
    <div v-for="result in activeData.results" :key="result.id"
         :class="{
           'list-tile': !isExpanded(result.id) || activeListType !== 'completed',
           'list-tile--expanded': isExpanded(result.id) && activeListType === 'completed'
         }">
      <div class="list-tile__image-wrapper">
        <div class="list-tile__image">
          <img :alt="'Bild der Serie ' + result.original_name" :src="imageUrl + result.poster_path"
               class="list-tile__img">
        </div>
      </div>

      <div class="list-tile__info-wrapper">
        <div class="list-tile__title">{{ result.original_name }} ({{
            result.details?.first_air_date.split('-')[0]
          }})
        </div>

        <!-- Show seasons/episodes for all except dropped -->
        <div v-if="activeListType !== 'dropped'">
          {{ result.details?.number_of_seasons }} Seasons / {{ result.details.number_of_episodes }} Episodes
        </div>

        <div v-if="calculateTotalRuntime(result) > 0" class="list-tile__runtime">
          Total Runtime: {{ formatRuntime(calculateTotalRuntime(result)) }}
        </div>

        <!-- Description section for all except dropped -->
        <template v-if="activeListType !== 'dropped'">
          <br>
          <div class="list-tile__description-wrapper">
            <div v-show="isExpanded(result.id)" class="list-tile__description-more">{{ result.overview }}</div>
            <div v-show="!isExpanded(result.id)" :ref="el => setDescriptionRef(el, result.id)"
                 class="list-tile__description-less">{{ result.overview }}
            </div>
            <action-button v-if="needsToggleButton(result.id) || isExpanded(result.id)"
                           :buttonName="toggleCtaLabel(result.id)"
                           primary @click="toggleExpanded(result.id)"></action-button>
          </div>
        </template>
      </div>

      <!-- Status for all except dropped -->
      <div v-if="activeListType !== 'dropped'" class="list-tile__status">
        {{ result.details?.status }}
      </div>

      <!-- Action buttons section -->
      <!-- Simple remove button for watchlist and dropped -->
      <button v-if="activeListType === 'watchlist' || activeListType === 'dropped'"
              class="list-tile__remove-button"
              @click="removeItemFromList(activeListType, result.id)">
        <Icon class="list-tile__remove-button-icon" name="trash"></Icon>
      </button>

      <!-- Extended action buttons for inProgress and completed -->
      <div v-else-if="activeListType === 'inProgress' || activeListType === 'completed'"
           class="list-tile__action-buttons">
        <div class="list-tile__remove-button-wrapper">
          <button class="list-tile__remove-button" @click="removeItemFromList(activeListType, result.id)">
            <Icon class="list-tile__remove-button-icon" name="trash"></Icon>
          </button>
        </div>
        <div class="list-tile__move-buttons">
          <!-- InProgress: can move to completed or dropped -->
          <template v-if="activeListType === 'inProgress'">
            <button class="list-tile__move-to-completed" @click="moveShowToCompletedList(result.id)">
              <Icon name="check_circle"></Icon>
            </button>
            <button class="list-tile__move-to-dropped" @click="moveShowToDroppedList(result.id)">
              <Icon name="cancel"></Icon>
            </button>
          </template>
          <!-- Completed: can move back to inProgress -->
          <template v-else-if="activeListType === 'completed'">
            <button class="list-tile__move-to-inProgress" @click="moveShowToInProgressList(result.id)">
              <Icon name="play_circle"></Icon>
            </button>
          </template>
        </div>
      </div>
    </div>
    
    <!-- Pagination at bottom -->
    <Pagination 
      :current-page="currentPage" 
      :total-results="totalResults"
      @page-change="$emit('page-change', $event)"
    />
  </div>
</template>

<style lang="less">
@import "../../../style/variables";

.list-tile {
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
}
</style>