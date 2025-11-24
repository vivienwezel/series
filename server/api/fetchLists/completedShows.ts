export default defineEventHandler((event) => {
    const config = useRuntimeConfig(event)
    const query = getQuery(event)
    const page = query.page || 1
    const url = `${config.public.apiBase}/list/${config.public.showIds.completed}?page=${page}`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${config.apiSecretReadOnly}`
        }
    };

    return fetch(url, options)
        .then(res => res.json())
        .catch(err => console.error('error:' + err));
})