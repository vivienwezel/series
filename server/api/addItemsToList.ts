export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event)
    const body = await readBody(event)
    
    const url = `${config.public.apiBase}/list/${config.public.showIds.watchlist}/items`;
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${config.apiSecret}`
        },
        body: JSON.stringify(body)
    };

    return fetch(url, options)
        .then(res => res.json())
        .catch(err => {
            console.error('error:' + err);
            throw err;
        });
})