// Cache for total runtime calculation (20 minutes TTL)
let runtimeCache: { value: number, timestamp: number } | null = null
const CACHE_TTL = 20 * 60 * 1000 // 20 minutes

async function calculateTotalRuntimeForAllShows(config: any, locale: string, options: any) {
    // Check cache first
    if (runtimeCache && Date.now() - runtimeCache.timestamp < CACHE_TTL) {
        return runtimeCache.value
    }

    let totalRuntime = 0
    let currentPage = 1
    let totalPages = 1

    try {
        // Fetch all pages to get all show IDs
        while (currentPage <= totalPages) {
            const url = `${config.public.apiBase}/list/${config.public.showIds.completed}?language=${locale}&page=${currentPage}`
            const res = await fetch(url, options)
            const pageData = await res.json()

            if (currentPage === 1) {
                totalPages = pageData.total_pages
            }

            // Fetch details for all shows on this page in parallel
            if (pageData.results && pageData.results.length > 0) {
                const detailsPromises = pageData.results.map(async (item: any) => {
                    try {
                        const detailsUrl = `https://api.themoviedb.org/3/tv/${item.id}?language=${locale}`
                        const detailsRes = await fetch(detailsUrl, options)
                        const details = await detailsRes.json()

                        // Calculate runtime for this show
                        if (details.episode_run_time && details.episode_run_time.length > 0 && details.number_of_episodes) {
                            const avgRuntime = details.episode_run_time.length > 1
                                ? details.episode_run_time.reduce((a: number, b: number) => a + b, 0) / details.episode_run_time.length
                                : details.episode_run_time[0]
                            return Math.round(avgRuntime * details.number_of_episodes)
                        }
                        return 0
                    } catch (err) {
                        console.error(`Error fetching details for show ${item.id}:`, err)
                        return 0
                    }
                })

                const runtimes = await Promise.all(detailsPromises)
                totalRuntime += runtimes.reduce((sum, runtime) => sum + runtime, 0)
            }

            currentPage++
        }

        // Cache the result
        runtimeCache = {value: totalRuntime, timestamp: Date.now()}
        return totalRuntime
    } catch (err) {
        console.error('Error calculating total runtime:', err)
        return 0
    }
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event)
    const query = getQuery(event)
    const page = query.page || 1

    // Locale mapping from nuxt.config.ts i18n configuration
    const localeMap: Record<string, string> = {
        'de.myseries.com': 'de-DE',
        'myseries.com': 'en-US'
    }

    // Determine locale based on hostname (strip port number)
    const host = (getRequestHeader(event, 'host') || '').split(':')[0]
    const locale = localeMap[host] || 'en-US'

    const url = `${config.public.apiBase}/list/${config.public.showIds.completed}?language=${locale}&page=${page}`
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${config.apiSecretReadOnly}`
        }
    }

    try {
        const res = await fetch(url, options)
        const listData = await res.json()

        // Enrich each show with basic details (for episode_run_time and number_of_episodes)
        if (listData.results && listData.results.length > 0) {
            const detailsPromises = listData.results.map(async (item: any) => {
                try {
                    const detailsUrl = `https://api.themoviedb.org/3/tv/${item.id}?language=${locale}`
                    const detailsRes = await fetch(detailsUrl, options)
                    const details = await detailsRes.json()
                    return {
                        ...item,
                        details: details
                    }
                } catch (err) {
                    console.error(`Error fetching details for show ${item.id}:`, err)
                    return item
                }
            })

            listData.results = await Promise.all(detailsPromises)
        }

        // Calculate total runtime for ALL shows (cached for 20 minutes)
        // Only calculate on page 1 to avoid redundant calculations
        if (page == 1) {
            const totalRuntime = await calculateTotalRuntimeForAllShows(config, locale, options)
            listData.total_runtime = totalRuntime
        } else if (runtimeCache) {
            // Use cached value for subsequent pages
            listData.total_runtime = runtimeCache.value
        }

        return listData
    } catch (err) {
        console.error('error:' + err)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch completed shows'
        })
    }
})