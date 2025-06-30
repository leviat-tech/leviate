<template>
  <div class="absolute z-10 left-4 top-4 flex flex-col space-x-p">
    <button
      v-for="tool in tools._raw"
      :key="tool"
      :title="formatter(tool.id)"
      :data-cy="`viewport_2d__tool_btn_${tool.id}`"
      class="border border-transparent rounded"
      :class="state.currentTool === tool.id && '!border-gray-500 bg-gray-100'"
      @click="handleToolClick(tool.id)"
    >
      <component :is="tool.icon" width="32" height="32" />
    </button>
  </div>
</template>

<script setup lang="ts">
import DToolbarButton from './DToolbarButton.vue';
import useDrawing from '../composables/useDrawing.ts';
import { ToolRegistrationConfig } from "../types";

const props = defineProps({
  items: Array,
  formatter: {
    type: Function,
    default: val => val,
  },
});

const emit = defineEmits(['select']);

const { state, tools } = useDrawing();

function castItemToToolConfig(toolStringOrConfig: string | ToolRegistrationConfig) {
  if (typeof toolStringOrConfig === 'object') return toolStringOrConfig;

  return {
    id: toolStringOrConfig,
    icon: toolStringOrConfig,
  }
}

props.items.forEach(item => {
  const toolConfig = castItemToToolConfig(item);

  tools.register(toolConfig);
});

const handleToolClick = tool => {
  tools._setCurrent(tool);
  emit('select', tool);
};
</script>
