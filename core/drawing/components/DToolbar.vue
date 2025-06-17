<template>
  <div class="absolute left-4 top-4 flex flex-col space-x-p">
    <button
      v-for="tool in items"
      :key="tool"
      :title="formatter(tool)"
      :data-cy="`viewport_2d__tool_btn_${tool}`"
      class="border border-transparent hover:bg-steel-light transition"
      :class="state.currentTool === tool && '!border-black bg-gray-100'"
      @click="handleToolClick(tool)"
    >
      <DToolbarButton width="32" height="32" :svgname="tool" />
    </button>
  </div>
</template>

<script setup>
import DToolbarButton from './DToolbarButton.vue';
import useDrawing from '../composables/useDrawing.ts';

defineProps({
  items: Array,
  formatter: {
    type: Function,
    default: val => val,
  },
});

const emit = defineEmits(['select']);

const { state, tools } = useDrawing();

const handleToolClick = tool => {
  tools._setCurrent(tool);
  emit('select', tool);
};
</script>
