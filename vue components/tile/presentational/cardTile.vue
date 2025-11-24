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
  if (flippedCards.value.has(cardId)) {
    flippedCards.value.delete(cardId);
  } else {
    flippedCards.value.add(cardId);
  }
}

function closeDescription(cardId: number) {
  descriptionAnimation.value.delete(cardId);
}
</script>

<template>
  <div class="card-tile">
    <!-- Pagination at top -->
    <Pagination 
      :current-page="currentPage" 
      :total-results="totalResults"
      @page-change="$emit('page-change', $event)"
    />
    
    <div v-if="activeListType === 'completed' && completedTotalRuntime > 0" class="series-tile__summary">
      <strong>Total Runtime:</strong> {{ formatRuntime(completedTotalRuntime) }} ({{ activeData.total_results }}
      shows)
    </div>
    <div v-else-if="isLoading" class="series-tile__loading-container">
      <Loading/>
    </div>
    <div class="card-tile__container">
      <div v-if="activeData" class="card-tile__wrapper">
        <div v-for="result in activeData.results" :key="result.id"
             :class="{'card--flipped': flippedCards.has(result.id)}"
             class="card">
          <div class="card__inner">
            <div class="card__face" @click="flipCard(result.id)">
              <div class="front-card">
                <img :src="imageUrl + result.poster_path" alt="">
              </div>
            </div>
            <div class="card__face card__face--back" @click="flipCard(result.id)">
              <div class="back-card">
                <div class="back-card__content">
                  <div class="back-card__info">
                    <h3>{{ result.name }} ({{ result.first_air_date.split('-')[0] }})</h3>
                    <div class="back-card__runtime">{{ result.details?.number_of_seasons }} Seasons /
                      {{ result.details.number_of_episodes }}
                      Episodes
                    </div>
                    <div>{{ result.details?.genres.map((genre: any) => genre.name).join(', ') }}</div>
                    <div class="back-card__status">
                      {{ result.details?.status }}
                    </div>
                  </div>

                  <div class="back-card__description-button">
                    <action-button button-name="Read Description" secondary
                                   @click.stop="openModal(result)"></action-button>
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

    <Modal v-if="selectedResult" :isOpen="activeModalCardId !== null" @modal-close="closeModal">
      <template #header>
        <h2>{{ selectedResult.name }} ({{ selectedResult.first_air_date.split('-')[0] }})</h2>
      </template>
      <template #content>
        <div class="modal-description">{{ selectedResult.overview }}</div>
      </template>
    </Modal>
  </div>
</template>

<style lang="less">
.card-tile {
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