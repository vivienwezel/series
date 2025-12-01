<script lang="ts" setup>
defineProps({
  buttonName: {
    type: String,
    required: true
  },

  primary: {
    type: Boolean,
    default: true
  },

  secondary: {
    type: Boolean,
    default: false
  }

})
</script>

<template>
  <button role="button">
    <span :class="{'primary-transition': primary, 'secondary-transition': secondary}"></span>
    <span :class="{'primary-gradient': primary, 'secondary-gradient': secondary}"></span>
    <span :class="{'primary-label': primary, 'secondary-label': secondary}">{{ buttonName }}</span>
  </button>
</template>

<style scoped>


button {
  height: 2.5rem;
  line-height: 0;
  font-size: 1rem;
  padding: 1em 2em;
  font-weight: 500;
  color: white;
  border: none;
  position: relative;
  overflow: hidden;
  border-radius: 0.4em;
  cursor: pointer;
  background-color: var(--beige);
}

.primary-gradient {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  border-radius: 0.4em;
  margin-top: -0.25em;
  background-image: linear-gradient(
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0.3)
  );
}

.primary-label {
  position: relative;
  top: -1px;
}

.primary-transition {
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
  transition-duration: 500ms;
  border-radius: 624.9375rem;
  width: 0;
  height: 0;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.primary-transition {
  background-color: var(--orange);
}

button:hover .primary-transition {
  width: 14em;
  height: 14em;
}

button:active {
  transform: scale(0.97);
}

button:focus-visible {
  outline: 2px solid var(--button-primary, #ffd700);
  outline-offset: 2px;
}

.secondary-gradient {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  border-radius: 0.4em;
  margin-top: -0.25em;
  background-image: linear-gradient(
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0.3)
  );
}

.secondary-label {
  position: relative;
  top: -1px;
}

.secondary-transition {
  background-color: var(--lighter-blue);
}

button:hover .secondary-transition {
  width: 14em;
  height: 14em;
}

button:has(.secondary-transition) {
  background-color: var(--blue);
}


</style>