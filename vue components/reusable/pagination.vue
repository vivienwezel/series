<template>
  <div class="pagination" v-if="totalPages > 1">
    <button @click="$emit('page-change', currentPage - 1)" :disabled="currentPage === 1">Previous</button>
    <span>Page {{ currentPage }} of {{ totalPages }}</span>
    <button @click="$emit('page-change', currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalResults: {
    type: Number,
    required: true
  }
});

defineEmits(['page-change']);

const totalPages = computed(() => Math.ceil(props.totalResults / 20));
</script>

<style lang="less">
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;

  span {
    color: var(--text-secondary);
    font-size: 0.8125rem;
    font-weight: 500;
  }

  button {
    width: fit-content;
    padding: 0.5rem 1rem;
    cursor: pointer;
    background-color: var(--surface);
    color: var(--text-primary);
    border: 1px solid var(--border-moderate);
    border-radius: 0.375rem;
    font-size: 0.8125rem;
    font-weight: 500;
    transition:
      background-color var(--transition-fast),
      border-color var(--transition-fast);

    &:hover:not(:disabled) {
      background-color: var(--surface-hover);
      border-color: var(--accent);
    }

    &:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
}
</style>