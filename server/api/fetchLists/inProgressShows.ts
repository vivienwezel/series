export default defineEventHandler((event) => {
    const config = useRuntimeConfig(event)
    const url = `${config.public.apiBase}/list/${config.public.showIds.inProgress}`;
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