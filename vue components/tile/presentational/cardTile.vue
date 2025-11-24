<script lang="ts" setup>
import {ref} from 'vue';
import Loading from "~/vue components/loading.vue";
import ActionButton from "~/vue components/buttons/actionButton.vue";

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
  }
})

const flippedCards = ref(new Set());
const descriptionAnimation = ref(new Set());
const backCardFloating = ref(new Set());

function flipCard(cardId: number) {
  if (flippedCards.value.has(cardId)) {
    flippedCards.value.delete(cardId);
  } else {
    flippedCards.value.add(cardId);
  }
}

function showDescription(cardId: number) {
  if (flippedCards.value.has(cardId)) {
    descriptionAnimation.value.add(cardId);
    backCardFloating.value.add(cardId);
  }
}

function closeDescription(cardId: number) {
  descriptionAnimation.value.delete(cardId);
  backCardFloating.value.delete(cardId);
}
</script>

<template>
  <div class="card-tile">
    <div v-if="activeListType === 'completed' && completedTotalRuntime > 0" class="series-tile__summary">
      <strong>Total Runtime:</strong> {{ formatRuntime(completedTotalRuntime) }} ({{ activeData.total_results }}
      shows)
    </div>
    <div v-else-if="isLoading" class="series-tile__loading-container">
      <Loading/>
    </div>
    <div class="card-tile__container">
      <div v-if="activeData" class="card-tile__wrapper">
        <div v-for="result in activeData.results" :key="result.id">
          <div v-if="flippedCards.has(result.id)" class="back-card" @click="flipCard(result.id)">
            <div>{{ result.name }}</div>
            <div>{{ result.first_air_date }}</div>
            <div>{{ result.details?.number_of_seasons }} Seasons / {{ result.details.number_of_episodes }} Episodes
            </div>
            <div class="back-card__description-button">
              <action-button button-name="Read Description" secondary
                             @click.stop="showDescription(result.id)"></action-button>
            </div>
            <div v-if="backCardFloating.has(result.id)" class="back-card-floating">
              <div class="back-card-floating__description-close" @click="closeDescription(result.id)">x</div>
              <div v-if="descriptionAnimation.has(result.id)" class="back-card-floating__description">
                {{ result.overview }}
              </div>
            </div>
          </div>
          <div v-else class="front-card" @click="flipCard(result.id)">
            <img :src="imageUrl + result.poster_path" alt="">

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.card-tile {
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
    width: 13.75rem;
    height: 20.625rem;
    border-radius: .4rem;

    img {
      border-radius: .4rem;
    }
  }

  .back-card {
    display: flex;
    flex-direction: column;
    border-radius: .4rem;
    background-color: var(--grey);
    width: 13.75rem;
    height: 20.625rem;
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
}
</style>