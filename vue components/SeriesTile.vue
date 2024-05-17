<template>
<div v-if="watchedData" class="series-tile__wrapper">
    <div  v-for="item in watchedData.items">
    <div class="series-tile">
    {{item.original_name}}
    {{item.overview}}
    {{item.poster_path}}
    {{item.genre_ids}}
    {{item.first_air_date}}
    </div>

    </div>
    {{watchedData.total_results}}
</div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'

const watchedData = ref(null)
const droppedData = ref(null)

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
    height: 10rem;
    box-shadow: var(--tile-box-shadow);
    border-radius: .5rem;
    background-color: var(--white);
    &__wrapper {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
};
</style>