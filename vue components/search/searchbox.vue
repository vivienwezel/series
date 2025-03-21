<template>
  <dialog id="searchDialog">
    <form class="searchbox__search-form">
      <label for="search-query">Search Series:</label>
      <input id="search-query" v-model="searchInput" autocomplete="off" class="searchbox__search-input"
             name="search-query"
             type="search">
      <button id="confirm-search" class="searchbox__search-submit-button" type="submit" value="default"
              @click.prevent="searchBundledData">Search
      </button>
      <button autofocus formmethod="dialog" value="cancel">Close</button>
    </form>
    <div v-if="searchInput !== ''" id="search-results">
      <div v-if="searchTvData && searchTvData.results && searchTvData.results.length > 0"
           class="searchbox__search-results">
        <h2>Shows</h2>
        <div v-for="result in searchTvData.results.slice(0, 5)" :key="result.id"
             class="searchbox__search-result-item">
          <img :alt="'Bild der Serie ' + result.original_name" :src="imageUrl + result.poster_path">

          <p class="searchbox__search-results-title">
            {{ result.name }}
          </p>
        </div>
        <div v-if="searchTvData.results.length > 5">
          Show more
        </div>
      </div>

      <div v-if="searchMovieData && searchMovieData.results && searchMovieData.results.length > 0"
           class="searchbox__search-results">
        <h2>Movies</h2>
        <div v-for="result in searchMovieData.results.slice(0, 5)" :key="result.id"
             class="searchbox__search-result-item">
          <img :alt="'Bild der Serie ' + result.original_name" :src="imageUrl + result.poster_path">

          <p class="searchbox__search-results-title">
            {{ result.title }}
          </p>
        </div>
        <div v-if="searchMovieData.results.length > 5">
          Show more
        </div>
      </div>
    </div>

    <div v-else-if="searchTvData && searchTvData.results && searchTvData.results.length === 0">
      No results found.
    </div>
  </dialog>
  <p>
    <button id="showDialog">Search</button>
    <img alt="search icon" src="../../icons/search.svg">
  </p>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "searchbox",
  data() {
    return {
      searchInput: '',
      searchTvData: null,
      searchMovieData: null,
      combinedSearchData: null,
      imageUrl: 'https://media.themoviedb.org/t/p/w220_and_h330_face'
    }
  },

  mounted() {
    const showButton = document.getElementById("showDialog");
    const searchDialog = document.getElementById("searchDialog");
    const confirmBtn = searchDialog.querySelector("#confirm-search");
    const closeButton = searchDialog.querySelector("button[value=cancel]");

// "Search" button opens the <dialog> modal
    showButton.addEventListener("click", () => {
      searchDialog.showModal();
    });

// Prevent the "confirm" button from the default behavior of submitting the form, and close the dialog with the `close()` method, which triggers the "close" event.
    confirmBtn.addEventListener("click", (event) => {
      event.preventDefault(); // We don't want to submit this fake form
    });

    closeButton.addEventListener("click", () => {
      this.searchInput.value = ''

    });
  },

  methods: {


    async searchSeriesData() {
      this.searchTvData = await $fetch('/api/searchTvData', {
        method: 'GET',
        params: {
          query: this.searchInput,
          language: 'en-US'
        }
      });
    },

    async searchMoviesData() {
      this.searchMovieData = await $fetch('/api/searchMovieData', {
        method: 'GET',
        params: {
          query: this.searchInput,
          language: 'en-US'
        }
      });
    },

    async searchBundledData() {
      await Promise.all([this.searchSeriesData(), this.searchMoviesData()]);

      this.combinedSearchData = {
        tv: this.searchTvData ? this.searchTvData.results : [],
        movies: this.searchMovieData ? this.searchMovieData.results : [],
        totalResults: (this.searchTvData ? this.searchTvData.total_results : 0) +
            (this.searchMovieData ? this.searchMovieData.total_results : 0)
      };

      console.log('Combined search data:', this.combinedSearchData);
    }
  }
})
</script>

<style lang="less">
#search-results {
  display: flex;
  flex-direction: row;
}

.searchbox {
  &__search-results {
    display: flex;
    flex-direction: column;
    padding: 1rem;

    &-title {
      align-content: center;
    }
  }

  &__search-result-item {
    display: flex;
    flex-direction: row;
    height: 5rem;
    margin: .5rem;
    gap: 1rem;
  }
}


/* Open state of the dialog  */
dialog:open {
  opacity: 1;
  transform: scaleY(1);
}

/* Closed state of the dialog   */
dialog {
  opacity: 0;
  transform: scaleY(0);
  transition: opacity 0.3s ease-out,
  transform 0.3s ease-out,
  overlay 0.3s ease-out allow-discrete,
  display 0.3s ease-out allow-discrete;
  /* Equivalent to
  transition: all 0.7s allow-discrete; */
}

/* Before open state  */
/* Needs to be after the previous dialog:open rule to take effect,
    as the specificity is the same */
@starting-style {
  dialog:open {
    opacity: 0;
    transform: scaleY(0);
  }
}

/* Transition the :backdrop when the dialog modal is promoted to the top layer */
dialog::backdrop {
  background-color: rgb(0 0 0 / 0%);
  transition: display 0.7s allow-discrete,
  overlay 0.7s allow-discrete,
  background-color 0.7s;
  /* Equivalent to
  transition: all 0.7s allow-discrete; */
}

dialog:open::backdrop {
  background-color: rgb(0 0 0 / 25%);
}

/* This starting-style rule cannot be nested inside the above selector
because the nesting selector cannot represent pseudo-elements. */

@starting-style {
  dialog:open::backdrop {
    background-color: rgb(0 0 0 / 0%);
  }
}

</style>