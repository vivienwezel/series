<template>
  <nav aria-label='Main navigation' class='series-header__navigation'>
    <NuxtLink
        v-for='item in items'
        :key='item.to'
        :to='item.to'
        :aria-label='item.ariaLabel ?? `Navigate to ${item.label} page`'
        class='series-header__navigation-link'
        tabindex='0'
    >
      <Icon :name='item.icon' aria-hidden='true' />
      <span>{{ item.label }}</span>
    </NuxtLink>
  </nav>
</template>

<script lang='ts' setup>
import Icon from '~/vue components/icons/Icon.vue';

interface MenuItem {
  to: string;
  icon: string;
  label: string;
  ariaLabel?: string;
}

defineProps<{
  items: MenuItem[];
}>();
</script>