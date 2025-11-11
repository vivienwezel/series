// Path: nuxt-frontend/app.vue

<script lang="ts" setup>
// Create Article type
type Article = {
  id: number;
  title: string;
  content: string;
  publishedAt: string;
  cover: {
    url: string;
  };
};

// Strapi API URL
const STRAPI_URL = "http://localhost:1337";

// Reactive state for articles and error
const articles = ref<{ data: Article[] } | null>(null);
const error = ref<Error | null>(null);
const isLoading = ref(true);

// Fetch articles with JWT token
const fetchArticles = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    const jwt = localStorage.getItem('jwt');

    articles.value = await $fetch<{ data: Article[] }>(
        `${STRAPI_URL}/api/articles?populate=*`,
        {
          headers: {
            Authorization: jwt ? `Bearer ${jwt}` : '',
          },
        }
    );
  } catch (err: any) {
    error.value = err;
    console.error('Error fetching articles:', err);
  } finally {
    isLoading.value = false;
  }
};

// Fetch on client-side only
onMounted(() => {
  fetchArticles();
});

// Format date
const formatDate = (date: Date) => {
  const options: any = {year: "numeric", month: "2-digit", day: "2-digit"};
  return new Date(date).toLocaleDateString("en-US", options);
};
</script>

<template>
  <main class="strapi-page">
    <h1>
      Nuxt.js and Strapi Integration
    </h1>

    <div v-if="isLoading" class="strapi-page__loading">
      <p>Loading articles...</p>
    </div>

    <div v-else-if="error" class="strapi-page__error">
      <p>Error loading articles: {{ error.message }}</p>
      <p v-if="error.statusCode === 403">Please make sure you are logged in and have the correct permissions.</p>
      <p v-else>Please try again or contact support.</p>
    </div>

    <div v-else-if="!articles?.data || articles.data.length === 0" class="strapi-page__empty">
      <p>No articles found.</p>
    </div>

    <div v-else aria-labelledby="articles-title" class="strapi-page__articles-section">
      <h2 class="strapi-page__articles-title">Latest Articles</h2>
      <div class="strapi-page__article-wrapper">
        <article
            v-for="article in articles?.data"
            :key="article.id"
            class="strapi-page__article"
        >
          <NuxtImg
              :alt="`Cover image for ${article.title}`"
              :src="`${STRAPI_URL}${article.cover.url}`"
              class="strapi-page__article-image"
          />

          <div class="strapi-page__article-info">
            <h3>
              {{ article.title }}
            </h3>

            <p>
              {{ formatDate(article.publishedAt) }}
            </p>
            <p>
              {{ article.content }}
            </p>
          </div>
        </article>
      </div>
    </div>
  </main>
</template>

<style lang="less">

h1 {
  color: var(--text-primary);
  display: flex;
  justify-content: center;
}

.strapi-page {
  padding: 1rem;

  &__loading {
    text-align: center;
    padding: 2rem;
    color: var(--text-primary);
    font-size: 1.1rem;
  }

  &__error {
    background-color: #ffebee;
    color: #c62828;
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #ef5350;

    p {
      margin: 0.5rem 0;
    }
  }

  &__empty {
    text-align: center;
    padding: 2rem;
    color: var(--text-primary);
    background-color: var(--tile-color);
    border-radius: 0.5rem;
    margin: 1rem;
  }

  &__articles-title {
    margin-bottom: 1rem;
    color: var(--text-primary);
    padding-left: 1rem;
  }

  &__articles-section {
    gap: 1rem;
  }

  &__article-info {
    padding-left: 1rem;
  }

  &__article-wrapper {
    display: flex;
    flex-basis: 30%;
    flex-direction: row;
    gap: 1rem;
    padding: 1rem;
    flex-wrap: wrap;
  }

  &__article {
    display: flex;
    flex-direction: column;
    flex-basis: 30%;
    background-color: var(--tile-color);
    border-radius: .5rem;
    box-shadow: var(--tile-box-shadow);
  }

  &__article-image {
    border-top-left-radius: .5rem;
    border-top-right-radius: .5rem;
    width: 100%;
    height: 100%;
  }
}
</style>