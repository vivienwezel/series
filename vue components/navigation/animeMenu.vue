<template>
  <MenuLinks :items='items' />
</template>

<script lang='ts' setup>
import MenuLinks from '~/vue components/navigation/menuLinks.vue';

const items = [
  { to: '/anime', icon: 'dashboard', label: 'Dashboard Test this is different Menu than series' },
  { to: '/anime/watchListPage', icon: 'bookmark', label: 'Watchlist' },
  { to: '/anime/inProgressPage', icon: 'play_circle', label: 'In Progress' },
  { to: '/anime/completedPage', icon: 'check_circle', label: 'Completed' }
];
</script>