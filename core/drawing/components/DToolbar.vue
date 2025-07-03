<template>
  <div class="absolute z-10 left-4 top-4 flex flex-col space-x-p">
    <div v-for="tool in tools._raw">
      <button
        :title="formatter(tool.id)"
        :data-cy="`viewport_2d__tool_btn_${tool.id}`"
        class="border border-transparent rounded"
        :class="
          (state.currentTool === tool.id || preview === tool.id) && '!border-gray-500 bg-gray-100'
        "
        @click="handleToolClick(tool.id)"
      >
        <component :is="tool.icon" width="32" height="32" />
      </button>

      <template v-if="tool.children && preview === tool.id">
        <button
          v-for="(child, index) in tool.children"
          @click="handleToolClick(child.id, tool.id)"
          class="border border-transparent rounded absolute left-10"
          :style="{ top: `${index * 35}px` }"
          :class="state.currentTool === child.id && '!border-gray-500 bg-gray-100'"
        >
          <component :is="child.icon" width="32" height="32" />
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import useDrawing from '../composables/useDrawing.ts';
import { ToolRegistrationConfig } from '../types';
import { DefineComponent, ref } from 'vue';

export type ToolbarItem = {
  id: string;
  icon: DefineComponent;
  handler?: () => void;
  children?: ToolbarItem[];
};

const props = defineProps({
  items: Array,
  formatter: {
    type: Function,
    default: (val) => val,
  },
});

const emit = defineEmits(['select']);

const preview = ref('');

const { state, tools } = useDrawing();

function castItemToToolConfig(toolStringOrConfig: string | ToolRegistrationConfig) {
  if (typeof toolStringOrConfig === 'object') return toolStringOrConfig;

  return {
    id: toolStringOrConfig,
    icon: toolStringOrConfig,
  };
}

props.items.forEach((item) => {
  const toolConfig = castItemToToolConfig(item);

  tools.register(toolConfig);
});

const handleToolClick = (toolId: string, parentId?: string) => {
  if (tools._raw[toolId]?.children?.length) {
    preview.value = toolId;
    tools._setCurrent(null);
    emit('select', null);
  } else {
    tools._setCurrent(toolId, parentId);
    emit('select', toolId);
  }
};
</script>
