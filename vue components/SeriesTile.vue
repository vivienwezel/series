<template>
<div v-if="watchedData" class="series-tile__wrapper">
    <div v-for="item in watchedData.items" class="series-tile">
        <div class="series-tile__image-wrapper">
            <div class="series-tile__image">
                <img :src="imageUrl + item.poster_path" :alt="'Bild der Serie ' + item.original_name">
            </div>
        </div>
        <div class="series-tile__info-wrapper">
            <div class="series-tile__title">{{item.original_name}}</div>
            <div class="series-tile__description">{{item.overview}}</div>
            <div class="series-tile__genres">{{item.genre_ids}}</div>
            <div class="series-tile__airdate">{{item.first_air_date}}</div>
        </div>
    </div>
    {{watchedData.total_results}}
</div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'

const watchedData = ref(null)
const droppedData = ref(null)
const imageUrl = ref('https://media.themoviedb.org/t/p/w220_and_h330_face')

onMounted(() => {
    watchedShowsData()
    droppedShowsData()
})

async function watchedShowsData() {
    watchedData.value = await $fetch('/api/watchedShows', {
        method: 'GET'
    });
    console.log(typeof watchedData, 'huhu');
}

async function droppedShowsData() {
    droppedData.value = await $fetch('/api/droppedShows', {
        method: 'GET'
    });
}
</script>
<<style lang="less">
@import "../style/variables";

.series-tile {
    display: flex;
    box-shadow: var(--tile-box-shadow);
    border-radius: .5rem;
    background-color: var(--white);
    gap: 2rem;
    &__wrapper {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    &__info-wrapper {
        flex-basis: 90%;
        padding: 1rem;
    }

    &__image-wrapper {
        flex-basis: 10%;
    }

    &__image {
        height: 100%;
        border-top-left-radius: .5rem;
        border-bottom-left-radius: .5rem;
    }
};
</style>