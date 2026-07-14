<script lang="ts" setup>
import Icon from "~/vue components/icons/Icon.vue";
import Loading from "~/vue components/loading.vue";
import Pagination from "~/vue components/reusable/pagination.vue";

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

defineEmits(['page-change'])
</script>

<template>
  <div v-if="isLoading" class="list-tile__loading-container">
    <Loading/>
  </div>
  <div v-else-if="activeData" class="list-tile__wrapper">
    <!-- Pagination at top -->
    <div class="list-tile__sorting">
      <Pagination
          :current-page="currentPage"
          :total-results="totalResults"
          @page-change="$emit('page-change', $event)"
      />
    </div>
    <!-- Summary header for completed list -->
    <section v-if="activeListType === 'completed' && (completedTotalRuntime && completedTotalRuntime > 0)"
             id="total-runtime"
             aria-labelledby="total-runtime-heading"
             class="list-tile__summary"
             role="region"
             tabindex="0">
      <h2 id="total-runtime-heading" class="list-tile__summary-heading">Total Runtime:</h2>
      <p aria-live="polite">{{ formatRuntime(completedTotalRuntime) }} ({{ activeData?.total_results }} completed
        shows)</p>
    </section>

    <!-- Main tile loop -->
    <div id="content-start" tabindex="-1"></div>
    <div v-for="result in activeData?.results" :key="result.id"
         role="group"
         :aria-label="result.original_name + ' (' + (result.details?.first_air_date?.split('-')[0] || '') + '). ' +
                          (activeListType !== 'dropped' ? (result.details?.number_of_seasons || 0) + ' Seasons, ' + (result.details?.number_of_episodes || 0) + ' Episodes. ' : '') +
                          (activeListType !== 'dropped' && calculateTotalRuntime(result) > 0 ? 'Total Runtime: ' + formatRuntime(calculateTotalRuntime(result)) + '. ' : '') +
                          (activeListType !== 'dropped' && result.details?.status ? 'Status: ' + result.details.status : '')"
         class="list-tile"
         tabindex="0">
      <div class="list-tile__image-wrapper">
        <div class="list-tile__image">
          <img :alt="'Bild der Serie ' + result.original_name" :src="imageUrl + result.poster_path"
               class="list-tile__img">
        </div>
      </div>

      <div class="list-tile__info-wrapper">
        <h3 :id="'tile-title-' + result.id" class="list-tile__title">{{ result.name }} ({{
            result.details?.first_air_date.split('-')[0]
          }})
        </h3>

        <!-- Show seasons/episodes for all except dropped -->
        <div v-if="activeListType !== 'dropped'" :id="'tile-info-' + result.id" class="list-tile__info">
          <p>
            {{ result.details?.number_of_seasons }} Seasons / {{ result.details.number_of_episodes }} Episodes
          </p>

          <p v-if="calculateTotalRuntime(result) > 0" class="list-tile__runtime">
            Total Runtime: {{ formatRuntime(calculateTotalRuntime(result)) }}
          </p>
        </div>
      </div>

      <!-- Status for all except dropped -->
      <div v-if="activeListType !== 'dropped'" :id="'tile-status-' + result.id" class="list-tile__status">
        {{ result.details?.status }}
        <div class="list-tile__genre">
          {{ result.details.genres.map(genre => genre.name).join(', ') }}
        </div>
      </div>

      <!-- Action buttons section -->
      <!-- Simple remove button for watchlist and dropped -->
      <button v-if="activeListType === 'watchList' || activeListType === 'dropped'"
              :aria-label="'Remove ' + result.original_name + ' from ' + activeListType"
              class="list-tile__remove-button"
              @click="removeItemFromList(activeListType, result.id)">
        <Icon aria-hidden="true" class="list-tile__remove-button-icon" name="trash"></Icon>
      </button>

      <!-- Extended action buttons for inProgress and completed -->
      <div v-else-if="activeListType === 'inProgress' || activeListType === 'completed'"
           :aria-label="'Actions for ' + result.name"
           class="list-tile__action-buttons"
           role="group">
        <div class="list-tile__remove-button-wrapper">
          <button :aria-label="'Remove ' + result.name + ' from ' + activeListType"
                  class="list-tile__remove-button"
                  @click="removeItemFromList(activeListType, result.id)">
            <Icon aria-hidden="true" class="list-tile__remove-button-icon" name="trash"></Icon>
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

    <!-- Pagination at bottom -->
    <div class="list-tile__sorting">
      <Pagination
          :current-page="currentPage"
          :total-results="totalResults"
          @page-change="$emit('page-change', $event)"
      />
    </div>
  </div>
</template>

<style lang="less">
@import "../../../style/variables";

// Screen reader only utility
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.list-tile {
  display: flex;
  height: 13rem;
  box-shadow: var(--tile-box-shadow);
  background-color: var(--tile-color);
  border-radius: .5rem;
  border: 1px solid var(--black);
  gap: 2rem;
  outline-offset: 2px;

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: 3px solid var(--button-primary, #ffd700);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &--expanded {
    display: flex;
    height: max-content;
    box-shadow: var(--tile-box-shadow);
    background-color: var(--tile-color);
    border-radius: .5rem;
    border: 1px solid var(--border-color);
    gap: 2rem;
    outline-offset: 2px;

    &:focus {
      outline: none;
    }

    &:focus-visible {
      outline: 3px solid var(--button-primary, #ffd700);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }

  &__sorting {
    display: flex;
    justify-content: space-between;
  }

  &__title {
    font-weight: bold;
    margin: 0;
    padding: 0;
    font-size: inherit;
  }

  &__info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 1px solid var(--black);
    padding-bottom: .5rem;
    margin: .5rem 0;
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
    display: flex;
    padding: 1rem 1.5rem;
    background-color: var(--beige);
    color: var(--text-secondary);
    border-radius: 0.5rem;
    font-size: 1.1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 0.5rem;
    gap: 0.5rem;
    outline-offset: 2px;

    &:focus-visible {
      outline: 3px solid var(--button-primary, #ffd700);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    }

    &-heading {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0;
      padding: 0;
    }

    p {
      margin: 0;
      padding: 0;
    }

    strong {
      font-weight: 600;
      margin-right: 0.5rem;
    }
  }

  &__info-wrapper {
    flex-basis: 75%;
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
    border-radius: 0.25rem;

    &:focus-visible {
      outline: 2px solid var(--button-primary, #ffd700);
      outline-offset: 2px;
    }

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

      &:focus-visible {
        outline: 2px solid var(--button-primary, #ffd700);
        outline-offset: 2px;
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
    flex-direction: column;
    justify-content: space-between;
    flex-basis: 15%;
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