export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event)
    const body = await readBody(event)
    
    // Get access token from custom header
    const accessToken = getHeader(event, 'x-access-token');

    if (!accessToken) {
        throw createError({
            statusCode: 401,
            message: 'Access token is required'
        });
    }

    // Extract listType and validate
    const { listType, items } = body;
    
    if (!listType || !config.public.showIds[listType]) {
        throw createError({
            statusCode: 400,
            message: `Invalid list type: ${listType}`
        });
    }

    // Use the appropriate list ID based on listType
    const listId = config.public.showIds[listType];
    const url = `${config.public.apiBase}/list/${listId}/items`;

    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ items })
    };

    return fetch(url, options)
        .then(res => res.json())
        .catch(err => {
            console.error('error:' + err);
            throw err;
        });
})