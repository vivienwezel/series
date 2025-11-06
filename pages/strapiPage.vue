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

// Create a function to fetch data from the Strapi API
const {data: articles} = useFetch<{ data: Article[] }>(
    `${STRAPI_URL}/api/articles?populate=*`,
);

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

    <div aria-labelledby="articles-title" class="strapi-page__articles-section">
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

          <div>
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

  &__articles-title {
    margin-bottom: 1rem;
    color: var(--text-primary);
    padding-left: 1rem;
  }

  &__articles-section {
    gap: 1rem;
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