<template>
  <div
    v-if="popup.isOpen"
    id="draw__popup-wrapper"
    ref="el"
    class="fixed z-10 p-2 bg-gray-50 border border-gray-300 shadow-lg -translate-x-1/2 -translate-y-1/2"
    :style="{ left: popup.x + 'px', top: popup.y + 'px' }"
    @keydown.enter="onConfirm"
    @keydown.esc="closePopup"
  >
    <slot />
    <DPopupButtons @cancel="closePopup" @confirm="onConfirm" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import useDrawing from '../../composables/useDrawing.ts';
import DPopupButtons from './DPopupButtons.vue';

const { popup, closePopup } = useDrawing();

const emit = defineEmits(['confirm']);

const el = ref(null);

const onConfirm = () => {
  emit('confirm');
  closePopup();
};

onMounted(() => {
  el.value.querySelector('input')?.select();
});
</script>
