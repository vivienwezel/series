<template>
  <select
      :id="id"
      :name="name"
      :value="modelValue"
      :disabled="disabled"
      @change="handleChange"
      class="select"
  >
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>

<script lang="ts" setup>
interface SelectOption {
  value: string | number;
  label: string;
}

const props = defineProps({
  options: {
    type: Array as () => SelectOption[],
    required: true
  },
  modelValue: {
    type: [String, Number] as () => string | number,
    default: ''
  },
  id: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
  emit('change', target.value);
}
</script>

<style scoped>
.select {
  padding: 0.375rem 0.625rem;
  height: 2.5rem;
  border-radius: 0.375rem;
  background-color: var(--grey);
  color: var(--text-secondary);
  border: 1px solid var(--dark-grey);
  font-size: 0.8125rem;
  cursor: pointer;
}

.select:hover {
  border-color: var(--orange);
}

.select:focus-visible {
  outline: 2px solid var(--orange);
  outline-offset: 2px;
}

.select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

</style>