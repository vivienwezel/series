export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event)
    const query = getQuery(event)
    const seriesId = query.id

    if (!seriesId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Series ID is required'
        })
    }

    // Using v3 API endpoint
    const url = `https://api.themoviedb.org/3/tv/${seriesId}`;
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
            statusMessage: 'Failed to fetch series details'
        })
    }
})
