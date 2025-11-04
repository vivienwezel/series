<script lang="ts" setup>
defineProps({
  buttonName: {
    type: String,
    required: true
  }
})
</script>

<template>
  <button class="primary-button" role="button">{{ buttonName }}</button>
</template>

<style scoped>


.primary-button {
  background-color: var(--button-primary);
  border-radius: 4px;
  color: var(--text-primary);
  border-color: var(--button-primary);
  cursor: pointer;
  font-family: arial, sans-serif;
  font-size: 14px;
  height: 36px;
  line-height: 27px;
  min-width: 54px;
  padding: 0 16px;
  text-align: center;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: pre;
  outline: none;

}

@keyframes buttonHover {
  from {
    background-color: var(--button-primary)
  }
  to {
    background-color: var(--button-primary-hover)
  }
}

.primary-button:hover {
  border: 1px solid var(--button-primary);
  background-color: var(--button-primary-hover);
  transform: translateY(-1px);
  box-shadow: rgba(0, 0, 0, .1) 0 1px 1px;
  color: var(--text-primary);
  animation-name: buttonHover;
  animation-duration: 1s;
}

.primary-button:focus {
  border-color: var(--button-primary);
  outline: none;
}

</style>