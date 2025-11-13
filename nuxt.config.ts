// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {enabled: true},

    devServer: {
        host: '0.0.0.0',
        port: 3000
    },

    vite: {
        server: {
            allowedHosts: ['myseries.com', 'de.myseries.com']
        }
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

    i18n: {
        locales: [
            {
                code: 'en',
                language: 'en-US',
                name: 'English',
                domain: 'myseries.com',
                files: ['en.json']
            },
            {
                code: 'de',
                language: 'de-DE',
                name: 'Deutsch',
                domain: 'de.myseries.com',
                files: ['de.json']
            }
        ],
        langDir: 'locales',
        defaultLocale: 'en',
        differentDomains: process.env.NODE_ENV === 'production',
        strategy: process.env.NODE_ENV === 'production' ? 'no_prefix' : 'prefix_except_default',
        detectBrowserLanguage: false
    },

    compatibilityDate: '2025-03-07',
    modules: ['@nuxt/image', '@nuxtjs/i18n']
})