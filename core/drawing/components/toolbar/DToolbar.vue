<template>
  <DToolbarWrapper class="absolute z-10 left-2 top-2">
    <div v-for="tool in tools._raw" class="space-y-">
      <div v-if="tool.id && tool.id !== DIVIDER_ID" class="relative flex">
        <DToolbarButton
          :title="formatter(tool.id)"
          :icon="getIcon(tool)"
          :is-active="state.currentTool === tool.id || activeParent === tool.id"
          @click="handleToolClick(tool)"
        />

        <DToolbarWrapper
          v-if="tool.children && activeParent === tool.id && state.isChildMenuOpen"
          class="absolute top-[-3px] left-10"
        >
          <DToolbarButton
            :title="formatter(tool.id)"
            v-for="child in tool.children"
            :icon="child.icon"
            :is-active="state.currentTool === child.id"
            @click="handleChildClick(child, tool.id)"
          />
        </DToolbarWrapper>
      </div>
      <div v-else-if="tool.id === DIVIDER_ID">
        <hr class="border-t-1 border-black my-2" />
      </div>
    </div>
  </DToolbarWrapper>
</template>

<script setup lang="ts">
import { TOOLBAR_OPTIONS } from '../../constants.js';
import useDrawing, { DIVIDER_ID } from '../../composables/useDrawing';
import { ToolItem } from '../../types';
import { ref, watch } from 'vue';
import type { Component } from 'vue';

import DToolbarButton from './DToolbarButton.vue';
import DToolbarWrapper from './DToolbarWrapper.vue';

const props = withDefaults(
  defineProps<{
    items: Array<ToolItem | null>;
    isDefaultIcons?: boolean;
    formatter?: (val: string) => string;
  }>(),
  {
    items: () => [],
    isDefaultIcons: true,
  }
);

const emit = defineEmits(['select']);

const activeParent = ref<string | null>(null);

const { state, tools } = useDrawing();

if (props.isDefaultIcons) {
  tools.addDefaultIcons();
}

props.items?.forEach((itemConfig) => tools._register(itemConfig));

const handleTool = (id: string, parentId: string | null, params?: any) => {
  tools._setCurrent(id, parentId);
  state.toolParams = params || {};
  emit('select', id);
};

const handleToolClick = (tool: ToolItem) => {
  const { id, icon, children, params } = tool;

  if (children?.length) {
    activeParent.value = id;
    state.isChildMenuOpen = true;
    const activeChild = children.find((child) => child.icon === icon) || children[0];
    handleTool(activeChild.id, id, activeChild.params);
  } else {
    handleTool(id, null, params);
  }
};

const handleChildClick = (tool: ToolItem, parentId: string) => {
  // Update the parent icon with the selected child item
  tools._raw[parentId].icon = tool.icon;

  handleTool(tool.id, parentId, tool.params);

  state.isChildMenuOpen = false;
};

const getIcon = (tool: ToolItem): Component | string => {
  const icon = tool.icon || tool.children?.[0]?.icon;

  if (!icon) {
    console.warn(`No icon found for ${tool.id}`);
    // Return a tag name to prevent errors
    return 'span';
  }

  return icon;
};

watch(
  () => state.currentTool,
  (val) => {
    if (val === TOOLBAR_OPTIONS.POINTER) {
      activeParent.value = null;
    }
  }
);
</script>
