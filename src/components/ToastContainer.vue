<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast-item pointer-events-auto"
          :class="toastClass(toast.type)"
          @click="remove(toast.id)"
        >
          <span class="toast-icon">{{ toastIcon(toast.type) }}</span>
          <span class="toast-message">{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast, type ToastType } from '@/composables/core/useToast';

const { toasts, remove } = useToast();

/**
 * Get CSS class based on toast type
 */
function toastClass(type: ToastType): string {
  const base = 'flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg backdrop-blur-md border text-sm cursor-pointer transition-all duration-200 hover:scale-[1.02]';
  
  switch (type) {
    case 'success':
      return `${base} bg-emerald-900/90 border-emerald-500/50 text-emerald-100`;
    case 'error':
      return `${base} bg-red-900/90 border-red-500/50 text-red-100`;
    case 'warning':
      return `${base} bg-amber-900/90 border-amber-500/50 text-amber-100`;
    case 'info':
    default:
      return `${base} bg-zinc-900/90 border-zinc-500/50 text-zinc-100`;
  }
}

/**
 * Get icon based on toast type
 */
function toastIcon(type: ToastType): string {
  switch (type) {
    case 'success':
      return '✓';
    case 'error':
      return '✕';
    case 'warning':
      return '⚠';
    case 'info':
    default:
      return 'ℹ';
  }
}
</script>

<style scoped>
.toast-enter-active {
  animation: toast-in 0.3s ease-out;
}

.toast-leave-active {
  animation: toast-out 0.2s ease-in forwards;
}

@keyframes toast-in {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes toast-out {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(100%);
  }
}

.toast-icon {
  font-size: 0.85rem;
  font-weight: bold;
}

.toast-message {
  max-width: 200px;
  word-break: break-word;
}
</style>
