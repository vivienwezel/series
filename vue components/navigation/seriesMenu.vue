<template>
  <MenuLinks :items='items'/>
</template>

<script lang='ts' setup>
import MenuLinks from '~/vue components/navigation/menuLinks.vue';

const items = [
  {to: '/series/seriesDashboardPage', icon: 'dashboard', label: 'Dashboard'},
  {to: '/series/watchListPage', icon: 'bookmark', label: 'Watchlist'},
  {to: '/series/inProgressShowsPage', icon: 'play_circle', label: 'In Progress'},
  {to: '/series/completedShowsPage', icon: 'check_circle', label: 'Completed'},
  {to: '/series/droppedShowsPage', icon: 'cancel', label: 'Dropped'}
];
</script>