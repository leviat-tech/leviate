<template>
  <DToolbarWrapper class="absolute z-10 left-4 top-4">
    <div v-for="tool in tools._raw" class="space-y-">
      <div class="relative flex">
        <DToolbarButton
          :icon="tool.icon || tool.children[0].icon"
          :is-active="state.currentTool === tool.id || activeParent === tool.id"
          @click="handleToolClick(tool)"
        />

        <DToolbarWrapper v-if="tool.children && activeParent === tool.id && isChildMenuOpen" class="absolute top-0 left-10">
          <DToolbarButton
            v-for="child in tool.children"
            :icon="child.icon"
            :is-active="state.currentTool === child.id"
            @click="handleChildClick(child, tool.id)"
          />
        </DToolbarWrapper>
      </div>
    </div>
  </DToolbarWrapper>
</template>

<script setup lang="ts">
import { TOOLBAR_OPTIONS } from '@crhio/leviate/drawing/constants.js';
import useDrawing from '../../composables/useDrawing.ts';
import { ToolItem } from '../../types';
import { ref, watch } from 'vue';
import DToolbarButton from './DToolbarButton.vue';
import DToolbarWrapper from './DToolbarWrapper.vue';

const props = defineProps({
  items: Array,
  formatter: {
    type: Function,
    default: (val) => val,
  },
});

const emit = defineEmits(['select']);

const activeParent = ref(null);
const isChildMenuOpen = ref(false);

const { state, tools } = useDrawing();

function castItemToToolConfig(toolStringOrConfig: string | ToolItem) {
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

const handleTool = (id: string, parentId: string, params: any) => {
  tools._setCurrent(id);
  state.toolParams = params || {};
  emit('select', id);
};

const handleToolClick = (tool: ToolItem) => {
  const { id, icon, children, handler, params } = tool;

  if (children?.length) {
    activeParent.value = id;
    isChildMenuOpen.value = true;
    const activeChild = children.find((child) => child.icon === icon) || children[0];
    activeChild.handler?.();
    tools._setCurrent(activeChild.id, id);
    handleTool(activeChild.id, id, activeChild.params);
    emit('select', id);
  } else {
    handleTool(id, null, params);
  }

  handler?.();
};

const handleChildClick = (tool: ToolItem, parentId: string) => {
  tools._raw[parentId].icon = tool.icon;
  handleTool(tool.id, parentId, tool.params);
  isChildMenuOpen.value = false;
};

watch(() => state.currentTool, (val) => {
  if (val === TOOLBAR_OPTIONS.POINTER) {
    activeParent.value = null;
  }
});
</script>
