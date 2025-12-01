// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},

    devServer: {
        host: '0.0.0.0', // Listen on all network interfaces
        port: 3000
    },

    app: {
        head: {
            link: [
                {
                    rel: 'preconnect',
                    href: 'https://fonts.googleapis.com'
                },
                {
                    rel: 'preconnect',
                    href: 'https://fonts.gstatic.com',
                    crossorigin: ''
                },
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap'
                }
            ]
        }
    },

    runtimeConfig: {
        // API secrets loaded from environment variables (.env file)
        apiSecretReadOnly: '', // NUXT_API_SECRET_READ_ONLY
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