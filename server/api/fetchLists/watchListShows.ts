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
    
    const url = `${config.public.apiBase}/list/${config.public.showIds.watchlist}?language=${locale}&page=${page}`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${config.apiSecretReadOnly}`
        }
    };

    try {
        const res = await fetch(url, options);
        return await res.json();
    } catch (err) {
        console.error('error:' + err);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch watchlist shows'
        });
    }
})