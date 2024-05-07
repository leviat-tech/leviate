<template>
  <LvPopupMenu  menu-button-classes="p-0" menu-container-classes="w-56">
    <template #button>
      <CTool :name="$l('layers_toggle')" tool-id="layers-toggle" icon="layers" :stateful="false">
      </CTool>
    </template>

    <div @click.stop>
      <ul class="px-1">
        <li
          v-for="{ name, label, isVisible } in selectableLayers"
          :key="name"
          :class="[
            'flex gap-1 p-2 items-center cursor-pointer hover:bg-steel-light',
            isVisible ? '' : 'opacity-60',
          ]"
          :data-cy="`viewport_toolbar__layers_visibility_tool_${name}`"
          @click="$emit('toggleLayer', name)"
        >
          <component :is="isVisible ? EyeIcon : EyeSlashIcon" class="h-4 pr-1" /><span>{{
            $L(label)
          }}</span>
        </li>
      </ul>

      <div class="flex justify-end m-4 mb-0 border-t pt-2">
        <CButton
          class=""
          :data-cy="`viewport_toolbar__layers_visibility_tool_show_all`"
          @click="$emit('showAllLayers')"
        >
          {{ $L('show_all') }}</CButton
        >
      </div>
    </div>
  </LvPopupMenu>
</template>

<script setup>
  import LvPopupMenu from '../ui/LvPopupMenu.vue';
  import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid';

  const props = defineProps({
    selectableLayers: {
      type: Array,
      default: [],
    },
  });
</script>
