<script lang="ts" setup>
import {ref} from 'vue';
import Loading from "~/vue components/loading.vue";
import ActionButton from "~/vue components/buttons/actionButton.vue";
import Modal from "~/vue components/reusable/modal.vue";
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

const flippedCards = ref(new Set());
const descriptionAnimation = ref(new Set());
const activeModalCardId = ref<number | null>(null);
const selectedResult = ref<any>(null);
const closeButtonRefs = ref<Map<number, HTMLElement>>(new Map());
const liveRegionMessage = ref('');

const openModal = (result: any) => {
  activeModalCardId.value = result.id;
  selectedResult.value = result;
};
const closeModal = () => {
  if (activeModalCardId.value !== null) {
    closeDescription(activeModalCardId.value);
  }
  activeModalCardId.value = null;
};

function flipCard(cardId: number) {
  const isCurrentlyFlipped = flippedCards.value.has(cardId);
  
  if (isCurrentlyFlipped) {
    flippedCards.value.delete(cardId);
    liveRegionMessage.value = 'Card closed, showing poster';
  } else {
    flippedCards.value.add(cardId);
    liveRegionMessage.value = 'Card expanded, showing details';
    
    // Move focus to close button after flip animation
    setTimeout(() => {
      const closeButton = closeButtonRefs.value.get(cardId);
      if (closeButton) {
        closeButton.focus();
      }
    }, 300); // Wait for flip animation
  }
}

function closeDescription(cardId: number) {
  descriptionAnimation.value.delete(cardId);
}

function setCloseButtonRef(el: any, cardId: number) {
  if (el) {
    closeButtonRefs.value.set(cardId, el);
  }
}
</script>

<template>
  <div class="card-tile">
    <!-- Live region for screen reader announcements -->
    <div aria-live="polite" aria-atomic="true" class="sr-only">
      {{ liveRegionMessage }}
    </div>
    <!-- Pagination at top -->
    <Pagination
        :current-page="currentPage"
        :total-results="totalResults"
        @page-change="$emit('page-change', $event)"
    />

    <section v-if="activeListType === 'completed' && completedTotalRuntime > 0"
             id="total-runtime"
             aria-labelledby="total-runtime-heading"
             class="card-tile__summary"
             role="region"
             tabindex="0">
      <h2 id="total-runtime-heading" class="card-tile__summary-heading">Total Runtime:</h2>
      <p aria-live="polite">{{ formatRuntime(completedTotalRuntime) }} ({{ activeData.total_results }} completed
        shows)</p>
    </section>
    <div v-else-if="isLoading" class="series-tile__loading-container">
      <Loading/>
    </div>
    <div id="content-start" tabindex="-1"></div>
    <div class="card-tile__container">
      <div v-if="activeData" class="card-tile__wrapper">
        <div v-for="result in activeData.results" :key="result.id"
             :class="{'card--flipped': flippedCards.has(result.id)}"
             class="card">
          <div class="card__inner">
            <div :aria-label="'Show details for ' + result.name" 
                 :aria-expanded="flippedCards.has(result.id)"
                 class="card__face" 
                 role="button" 
                 tabindex="0"
                 @click="flipCard(result.id)" 
                 @keydown.enter="flipCard(result.id)"
                 @keydown.space.prevent="flipCard(result.id)">
              <div class="front-card">
                <img :alt="'Poster of ' + result.name" :src="imageUrl + result.poster_path">
              </div>
            </div>
            <div class="card__face card__face--back" 
                 @click.self="flipCard(result.id)">
              <div class="back-card" @click.self="flipCard(result.id)">
                <div class="back-card__content">
                  <button class="back-card__close-button" 
                          :ref="el => setCloseButtonRef(el, result.id)"
                          :tabindex="flippedCards.has(result.id) ? 0 : -1"
                          :aria-describedby="'back-card-info-' + result.id"
                          @click="flipCard(result.id)"
                          @keydown.esc="flipCard(result.id)"
                          :aria-label="'Close details for ' + result.name"
                          type="button">
                    ✕
                  </button>
                  <div :id="'back-card-info-' + result.id" class="back-card__info">
                    <h3 class="back-card__title">{{ result.name }} ({{ result.first_air_date.split('-')[0] }})</h3>
                    <div class="back-card__runtime">{{ result.details?.number_of_seasons }} Seasons /
                      {{ result.details.number_of_episodes }}
                      Episodes
                    </div>
                    <div class="back-card__genres">{{ result.details?.genres.map((genre: any) => genre.name).join(', ') }}</div>
                    <div class="back-card__status">
                      {{ result.details?.status }}
                    </div>
                  </div>

                  <div class="back-card__description-button">
                    <button type="button" 
                            class="description-button"
                            :tabindex="flippedCards.has(result.id) ? 0 : -1"
                            @click.stop="openModal(result)"
                            :aria-label="'Read description for ' + result.name">
                      Read Description
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination at bottom -->
    <Pagination
        :current-page="currentPage"
        :total-results="totalResults"
        @page-change="$emit('page-change', $event)"
    />

    <Modal v-if="selectedResult" 
           :isOpen="activeModalCardId !== null"
           @modal-close="closeModal">
      <template #header>
        {{ selectedResult.name }} ({{ selectedResult.first_air_date.split('-')[0] }})
      </template>
      <template #content>
        {{ selectedResult.overview }}
      </template>
    </Modal>
  </div>
</template>

<style lang="less">
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

.card-tile {

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

  .card {
    perspective: 1000px;
    width: 13.75rem;
    height: 20.625rem;

    &__inner {
      position: relative;
      width: 100%;
      height: 100%;
      transition: transform .6s ease;
      transform-style: preserve-3d;
      border-radius: .4rem;
    }

    &__face {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      border-radius: .4rem;
    }

    &__face--back {
      transform: rotateY(180deg);
    }

    &--flipped {
      .card__inner {
        transform: rotateY(180deg);
      }
    }
  }

  &__container {
    display: flex;
    margin-top: 2rem;
  }

  &__wrapper {
    display: flex;
    flex-wrap: wrap;
    row-gap: 1.5rem;
    justify-content: space-between;
  }

  .front-card {
    width: 100%;
    height: 100%;
    border-radius: .4rem;

    img {
      border-radius: .4rem;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .back-card {
    display: flex;
    flex-direction: column;
    border-radius: .4rem;
    background: var(--tile-background);
    width: 100%;
    height: 100%;
    position: relative;

    &__close-button {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: rgba(0, 0, 0, 0.5);
      color: white;
      border: none;
      border-radius: 50%;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1.2rem;
      line-height: 1;
      z-index: 10;
      transition: background-color 0.2s;

      &:hover {
        background: rgba(0, 0, 0, 0.7);
      }

      &:focus-visible {
        outline: 2px solid var(--button-primary, #ffd700);
        outline-offset: 2px;
      }
    }

    &__title {
      margin: 0;
      padding: 0;
      font-size: 1rem;
    }

    &__content {
      display: flex;
      height: 100%;
      justify-content: space-between;
      flex-direction: column;
      padding: 1rem;
    }

    &__runtime {
      margin-bottom: 1rem;
    }

    &__status {
      margin-top: 1rem;
      font-weight: bold;
    }

    &__description-button {
      margin-top: 1rem;
    }
  }

  .description-button {
    width: 100%;
    padding: 0.75rem 1.5rem;
    background-color: var(--lighter-blue, #007bff);
    color: white;
    border: none;
    border-radius: 0.4rem;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: background-color 0.2s ease, transform 0.1s ease;

    &:hover {
      background-color: var(--blue, #0056b3);
    }

    &:active {
      transform: scale(0.97);
    }

    &:focus-visible {
      outline: 2px solid var(--button-primary, #ffd700);
      outline-offset: 2px;
    }
  }

  .back-card-floating {
    position: absolute;
    margin: 0 auto;
    width: 15rem;
    height: 20rem;
    background-color: var(--grey);
    color: var(--text-secondary);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    z-index: 1;
  }

  .modal-description {
    margin: 0;
    line-height: 1.6;
  }
}
</style>