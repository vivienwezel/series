export default defineEventHandler((event) => {
    const config = useRuntimeConfig(event)
    const url = `${config.public.apiBase}/search/tv?query=monk&include_adult=false&language=en-US&page=1`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${config.apiSecret}`
        }
    };

    return fetch(url, options)
        .then(res => res.json())
        .catch(err => console.error('error:' + err));
})