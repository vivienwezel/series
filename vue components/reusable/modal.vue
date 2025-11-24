<script setup>
import {defineEmits, defineProps, ref} from "vue";
import {onClickOutside} from '@vueuse/core'

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(["modal-close"]);

const target = ref(null)
onClickOutside(target, () => emit('modal-close'))

</script>

<template>
  <Transition name="modal">
    <div v-if="isOpen" class="modal-mask">
      <div class="modal-wrapper">
        <div ref="target" class="modal-container">
          <div class="modal-header">
            <slot name="header"> default header</slot>
          </div>
          <div class="modal-body">
            <slot name="content"> default content</slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <div>
                <button class="modal-close-btn" @click.stop="emit('modal-close')">Close</button>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Backdrop fade-in animation */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Modal container scale/slide animation */
.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: all 0.4s ease;
}

.modal-enter-from .modal-container {
  transform: scale(0.5) translateY(-500px);
  opacity: 0;
}

.modal-leave-to .modal-container {
  transform: scale(0.5) translateY(500px);
  opacity: 0;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.modal-container {
  max-width: 600px;
  width: 90%;
  padding: 2rem;
  background-color: var(--grey, #2a2a2a);
  color: var(--text-secondary, #fff);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.modal-body {
  margin-bottom: 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
}

.modal-close-btn {
  padding: 0.5rem 1.5rem;
  background-color: var(--lighter-blue, #007bff);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.modal-close-btn:hover {
  background-color: var(--blue, #0056b3);
}
</style>