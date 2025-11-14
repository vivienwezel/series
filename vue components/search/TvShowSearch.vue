<template>
  <div class="tv-show-search">
    <form class="tv-show-search__form" @submit.prevent="searchShows">
      <label for="tv-search-query">{{ $t('tv.search.label') }}</label>
      <div class="tv-show-search__input-wrapper">
        <input
            id="tv-search-query"
            v-model="searchInput"
            :placeholder="$t('tv.search.placeholder')"
            autocomplete="off"
            class="tv-show-search__input"
            name="tv-search-query"
            type="search"
            @input="handleInputChange"
        >
        <button
            v-if="searchInput"
            aria-label="Clear search"
            class="tv-show-search__clear-button"
            type="button"
            @click="clearSearch"
        >
          <img alt="Clear" height="20" src="/icons/close.svg" width="20">
        </button>
      </div>
    </form>

    <div v-if="searchInput !== '' && searchResults" class="tv-show-search__results">
      <div v-if="searchResults.results && searchResults.results.length > 0">
        <h2>Search Results ({{ searchResults.results.length }})</h2>
        <div class="tv-show-search__result-item-wrapper">
          <div
              v-for="result in paginatedResults"
              :key="result.id"
              class="tv-show-search__result-item"
          >
            <img
                v-if="result.poster_path"
                :alt="'Poster of ' + result.name"
                :src="imageUrl + result.poster_path"
                class="tv-show-search__result-image"
            >
            <div
                v-else
                class="tv-show-search__result-image-placeholder"
            >
              No Image
            </div>
            <div class="tv-show-search__result-info">
              <p class="tv-show-search__result-title">
                {{ result.name }}
              </p>
              <p v-if="result.first_air_date" class="tv-show-search__result-date">
                {{ new Date(result.first_air_date).getFullYear() }}
              </p>
            </div>
            <div class="tv-show-search__buttons">
              <button class="tv-show-search__add-to-watchlist" type="button" @click="addToList(result.id, 'watchlist')">
                <Icon name="bookmark"></Icon>
              </button>
              <button class="tv-show-search__add-to-ongoing-list" type="button"
                      @click="addToList(result.id, 'inProgress')">
                <Icon name="play_circle"></Icon>
              </button>
              <button class="tv-show-search__add-to-completed-list" type="button"
                      @click="addToList(result.id, 'completed')">
                <Icon name="check_circle"></Icon>
              </button>
              <button class="tv-show-search__add-to-dropped-list" type="button"
                      @click="addToList(result.id, 'dropped')">
                <Icon name="cancel"></Icon>
              </button>
            </div>
          </div>
        </div>

        <div v-if="totalPages > 1" class="tv-show-search__pagination">
          <button
              :disabled="currentPage === 1"
              class="tv-show-search__pagination-button"
              type="button"
              @click="previousPage"
          >
            Previous
          </button>
          <span class="tv-show-search__pagination-info">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button
              :disabled="currentPage === totalPages"
              class="tv-show-search__pagination-button"
              type="button"
              @click="nextPage"
          >
            Next
          </button>
        </div>
      </div>

      <div v-else-if="searchResults.results && searchResults.results.length === 0">
        <p>{{ $t('no.tv.results') }} "{{ searchInput }}"</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import ActionButton from '~/vue components/buttons/actionButton.vue'
import Icon from "~/vue components/icons/Icon.vue";

export default defineComponent({
  name: "TvShowSearch",
  components: {
    PrimaryButton: ActionButton,
    Icon
  },
  emits: ['item-added'],
  data() {
    return {
      searchInput: '',
      searchResults: null,
      imageUrl: 'https://media.themoviedb.org/t/p/w220_and_h330_face',
      searchTimeout: null,
      currentPage: 1,
      resultsPerPage: 6
    }
  },

  computed: {
    paginatedResults() {
      if (!this.searchResults || !this.searchResults.results) {
        return [];
      }
      const start = (this.currentPage - 1) * this.resultsPerPage;
      const end = start + this.resultsPerPage;
      return this.searchResults.results.slice(start, end);
    },

    totalPages() {
      if (!this.searchResults || !this.searchResults.results) {
        return 0;
      }
      return Math.ceil(this.searchResults.results.length / this.resultsPerPage);
    }
  },

  beforeUnmount() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  },

  methods: {
    async addToList(mediaId, listType) {
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
    },

    async searchShows() {
      if (!this.searchInput.trim()) {
        return;
      }

      try {
        this.currentPage = 1; // Reset to first page on new search
        this.searchResults = await $fetch('/api/fetchSearch/searchTvData', {
          method: 'GET',
          params: {
            query: this.searchInput,
            language: 'en-US'
          }
        });
      } catch (error) {
        console.error('Error searching TV shows:', error);
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },

    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    clearSearch() {
      this.searchInput = '';
      this.searchResults = null;
      this.currentPage = 1;
    },

    handleInputChange() {
      // Reset search results when input is cleared via keyboard
      if (!this.searchInput || this.searchInput.trim() === '') {
        this.searchResults = null;
        if (this.searchTimeout) {
          clearTimeout(this.searchTimeout);
        }
        return;
      }

      // Debounced live search while typing
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }

      this.searchTimeout = setTimeout(() => {
        this.searchShows();
      }, 500); // Wait 500ms after user stops typing
    }
  }
})
</script>

<style lang="less" scoped>
.tv-show-search {
  width: 100%;

  &__form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;

    label {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary, #333);
    }

    button {
      border-radius: 0.5rem;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 700;
      padding: 0.75rem 1.5rem;
      transition: opacity 0.2s;

      &:hover {
        opacity: 0.9;
      }
    }
  }

  &__buttons {
    display: flex;
    gap: 0.5rem;

    button {
      display: flex;
      background: var(--button-secondary, #fff);
      border: 1px solid var(--grey, #ccc);
      border-radius: .5rem;
      height: 3rem;
      width: 2rem;

      :hover {
        cursor: pointer;
      }
    }

    :deep(svg path:not([fill="none"])) {
      fill: var(--button-primary);
    }
  }

  &__input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  &__input {
    width: 100%;
    padding: 0.75rem 2.5rem 0.75rem 0.75rem;
    font-size: 1rem;
    border: 1px solid var(--border-color, #ccc);
    border-radius: 0.5rem;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
      border: 2px solid var(--button-primary, #ffd700);
    }
  }

  &__submit-button {
    background-color: var(--button-primary, #ffd700);
  }

  &__clear-button {
    position: absolute;
    right: 0.5rem;
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    opacity: 0.6;
    transition: opacity 0.2s;

    &:hover {
      opacity: 1;
    }

    img {
      display: block;
    }
  }

  &__results {
    h2 {
      font-size: 1.25rem;
      margin-bottom: 1rem;
      color: var(--text-primary, #333);
    }
  }

  &__pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color, #e0e0e0);
    margin-bottom: 3rem;
  }

  &__pagination-button {
    padding: 0.5rem 1rem;
    background-color: var(--button-secondary, #ffd700);
    border: none;
    border-radius: 0.5rem;
    color: var(--dark-blue, #1a1a2e);
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover:not(:disabled) {
      opacity: 0.9;
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  &__pagination-info {
    font-size: 0.875rem;
    color: var(--text-primary, #666);
    min-width: 100px;
    text-align: center;
  }

  &__result-item {
    display: flex;
    background-color: var(--white);
    width: 45%;
    padding: 1rem;
    margin-bottom: 1rem;
    border: 1px solid var(--border-color, #e0e0e0);
    border-radius: 0.5rem;
    transition: box-shadow 0.2s;

    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    &-wrapper {
      display: flex;
      flex-wrap: wrap;
      column-gap: 1rem;
    }
  }

  &__result-image {
    width: 4.375rem;
    height: 6.875rem;
    object-fit: cover;
    border-radius: 0.25rem;
    flex-shrink: 0;
    margin-right: 1rem;
  }

  &__result-image-placeholder {
    width: 4.375rem;
    height: 6.875rem;
    background-color: var(--border-color, #e0e0e0);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.25rem;
    flex-shrink: 0;
    color: #999;
    font-size: 0.875rem;
  }

  &__result-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__result-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0;
    color: var(--text-secondary, #333);
  }

  &__result-date {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-secondary, #666);
  }

  &__result-overview {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.4;
    color: var(--text-secondary, #666);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
</style>
