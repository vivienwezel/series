// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {enabled: true},

  runtimeConfig: {
    apiSecret: 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2OWI2MzlkMzE3MTkxYmI5MzdkMmYzNWEwY2IyMjI2MCIsInN1YiI6IjY2MTY5ZTIwMjQyZjk0MDE3ZGM0ZTRmYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-rt00T0F-35KD7JaTNHAsoRmahXwQNh_jWeQKBHTpt0',
    public: {
      apiBase: 'https://api.themoviedb.org/3'
    }
  },

  compatibilityDate: '2025-03-07'
})