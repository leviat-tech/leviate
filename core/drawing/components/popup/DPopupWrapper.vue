<template>
  <div
    v-if="popup.isOpen"
    id="draw__popup-wrapper"
    ref="el"
    class="fixed z-30 p-2 bg-gray-50 border border-gray-400 shadow-lg -translate-x-1/2 -translate-y-1/2 rounded"
    :style="{ left: popup.x + 'px', top: popup.y + 'px' }"
    @keydown.enter="onConfirm"
    @keydown.esc="closePopup"
  >
    <slot />
    <DPopupButtons @cancel="closePopup" @confirm="onConfirm" />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import useDrawing from '../../composables/useDrawing.ts';
import DPopupButtons from './DPopupButtons.vue';

const { state, popup, closePopup } = useDrawing();

const emit = defineEmits(['confirm']);

const el = ref(null);

const onConfirm = () => {
  emit('confirm');
  closePopup();
};

onMounted(() => {
  el.value.querySelector('input')?.select();
});

watch(() => state.currentTool, closePopup);
</script>
