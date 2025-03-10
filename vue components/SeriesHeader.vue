<template>
  <div class="series-header__wrapper">
    <div class="series-header__search">
      <dialog id="searchDialog">
        <form class="series-header__search-form">
          <label for="search-query">Search Series:</label>
          <input id="search-query" v-model="searchInput" autocomplete="off" class="series-header__search-input"
                 name="search-query"
                 type="search">
          <button id="confirm-search" class="series-header__search-submit-button" type="submit" value="default"
                  @click.prevent="searchSeriesData">Search
          </button>
          <button autofocus formmethod="dialog" value="cancel">Close</button>
        </form>
        <div v-if="searchInput !== ''" id="search-results">
          <div v-if="searchData && searchData.results && searchData.results.length > 0"
               class="series-header__search-results">
            <div v-for="result in searchData.results.slice(0, 5)" :key="result.id"
                 class="series-header__search-result-item">
              <div class="series-header__search-results-title">
                {{ result.title }}
              </div>
            </div>
            <div v-if="searchData.results.length > 5">
              Show more
            </div>
          </div>
        </div>
        <div v-else-if="searchData && searchData.results && searchData.results.length === 0">
          No results found.
        </div>
      </dialog>
      <p>
        <button id="showDialog">Search</button>
      </p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {onMounted, ref} from 'vue'

const searchData = ref(null)
const searchInput = ref('')

onMounted(() => {
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
})

async function searchSeriesData() {

  searchData.value = await $fetch('/api/searchData', {
    method: 'GET',
    params: {
      query: searchInput.value,
      language: 'en-US'
    }
  });
}

</script>

<style lang="less">

.series-header {
  &__wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    height: 10rem;
    background-color: var(--lighter-blue);
  }

  &__search {
    &-form {
      display: flex;
    }

    &-input {
      width: 30rem;
      height: 2rem;
    }

    &-submit-button {
      width: 5rem;
    }
  }

  &__search-results {
    display: flex;
    flex-direction: column;
    padding: 1rem;
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
