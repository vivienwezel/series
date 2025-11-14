export default defineCachedEventHandler(async (event) => {
    const config = useRuntimeConfig(event)
    const query = getQuery(event)
    const seriesId = query.seriesId
    const seasonNumber = query.seasonNumber

    if (!seriesId || seasonNumber === undefined) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Series ID and Season Number are required'
        })
    }

    // Locale mapping from nuxt.config.ts i18n configuration
    const localeMap: Record<string, string> = {
        'de.myseries.com': 'de-DE',
        'myseries.com': 'en-US'
    }
    
    // Determine locale based on hostname
    const host = getRequestHeader(event, 'host') || ''
    const locale = localeMap[host] || 'en-US'

    // Using v3 API endpoint for season details
    const url = `https://api.themoviedb.org/3/tv/${seriesId}/season/${seasonNumber}?language=${locale}`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${config.apiSecretReadOnly}`
        }
    };

    try {
        const response = await fetch(url, options)
        return await response.json()
    } catch (err) {
        console.error('error:' + err);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch season details'
        })
    }
}, {
    maxAge: 60 * 60, // Cache for 1 hour (season details don't change often)
    getKey: (event) => {
        const query = getQuery(event)
        const host = getRequestHeader(event, 'host') || ''
        return `tv-season-${query.seriesId}-${query.seasonNumber}-${host}`
    }
})
