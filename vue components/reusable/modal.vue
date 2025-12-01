<script setup>
import {defineEmits, defineProps, ref, watch, nextTick} from "vue";

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(["modal-close"]);

const dialogRef = ref(null)

// Open/close dialog using native methods
watch(() => props.isOpen, async (newVal) => {
  await nextTick() // Wait for DOM to be ready
  
  if (!dialogRef.value) {
    return
  }
  
  if (newVal && !dialogRef.value.open) {
    dialogRef.value.showModal()
  } else if (!newVal && dialogRef.value.open) {
    dialogRef.value.close()
  }
}, { immediate: true })

// Handle native close event (e.g., Escape key or backdrop click)
const handleClose = () => {
  emit('modal-close')
}

// Close on backdrop click
const handleBackdropClick = (event) => {
  if (event.target === dialogRef.value) {
    handleClose()
  }
}

</script>

<template>
  <dialog 
    ref="dialogRef"
    class="modal-dialog"
    aria-labelledby="modal-header"
    @close="handleClose"
    @click="handleBackdropClick">
    <div class="modal-content" @click.stop>
      <div id="modal-header" class="modal-header">
        <slot name="header">default header</slot>
      </div>
      <div class="modal-body">
        <slot name="content">default content</slot>
      </div>
      <div class="modal-footer">
        <slot name="footer">
          <button class="modal-close-btn" 
                  type="button"
                  @click="handleClose">
            Close
          </button>
        </slot>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
/* Native dialog element */
.modal-dialog {
  max-width: 600px;
  width: 90%;
  padding: 0;
  border: none;
  border-radius: 12px;
  background: transparent;
  box-shadow: none;
}

/* Native backdrop styling */
.modal-dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* Animation when opening */
.modal-dialog[open] {
  animation: modal-appear 0.3s ease-out;
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-content {
  padding: 2rem;
  background-color: var(--grey, #2a2a2a);
  color: var(--text-secondary, #fff);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.4;
  margin: 0 0 1rem 0;
}

.modal-body {
  margin-bottom: 1.5rem;
  line-height: 1.6;
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

.modal-close-btn:focus-visible {
  outline: 2px solid var(--button-primary, #ffd700);
  outline-offset: 2px;
}
</style>