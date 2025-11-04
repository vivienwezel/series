export default defineEventHandler(async (event) => {
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

    // Using v3 API endpoint for season details
    const url = `https://api.themoviedb.org/3/tv/${seriesId}/season/${seasonNumber}`;
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
})
