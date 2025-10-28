// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},

    runtimeConfig: {
        apiSecretReadOnly: 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2OWI2MzlkMzE3MTkxYmI5MzdkMmYzNWEwY2IyMjI2MCIsIm5iZiI6MTcxMjc1ODMwNC45NjIsInN1YiI6IjY2MTY5ZTIwMjQyZjk0MDE3ZGM0ZTRmYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-gp0hEsB0cOC5Y4X1GV9WWrztaGpLWQsRilk1LRjBVA',
        apiSecret: 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2OWI2MzlkMzE3MTkxYmI5MzdkMmYzNWEwY2IyMjI2MCIsInN1YiI6IjY2MTY5ZTIwMjQyZjk0MDE3ZGM0ZTRmYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-rt00T0F-35KD7JaTNHAsoRmahXwQNh_jWeQKBHTpt0',
        public: {
            apiBaseV3: 'https://api.themoviedb.org/3',
            apiBase: 'https://api.themoviedb.org/4',
            showIds: {
                watchlist: 8565917,
                completed: 8296909,
                dropped: 8296910,
                inProgress: 8567808
            }
        }

    },

    compatibilityDate: '2025-03-07'
})