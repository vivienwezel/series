<template>
{{searchData}}
</template>
<script setup lang="ts">
import {ref, onMounted} from 'vue'

const searchData = ref(null)

onMounted(() => {
    searchSeriesData()
})

async function searchSeriesData() {
    searchData.value = await $fetch('/api/searchData', {
        method: 'GET'
    });
    console.log(typeof searchData, 'huhu');
}

</script>
