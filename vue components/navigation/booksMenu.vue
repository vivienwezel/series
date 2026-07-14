<template>
  <MenuLinks :items='items'/>
</template>

<script lang='ts' setup>
import MenuLinks from '~/vue components/navigation/menuLinks.vue';

const items = [
  {to: '/books', icon: '', label: 'Dashboard'},
  {to: '/books/currentlyReadingPage', icon: 'menu_book', label: 'Reading'},
  {to: '/books/toReadPage', icon: 'bookmark', label: 'To Read'},
  {to: '/books/completedPage', icon: 'check_circle', label: 'Completed'}
];
</script>