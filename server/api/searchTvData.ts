import {getQuery} from 'h3'

export default defineEventHandler((event) => {
    const config = useRuntimeConfig(event)
    const query = getQuery(event)
    const searchInput = query.query || ''
    const searchLanguage = query.language || 'en'
    const url = `${config.public.apiBase}/search/tv?query=${searchInput}&include_adult=false&language=${searchLanguage}&page=1`;
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