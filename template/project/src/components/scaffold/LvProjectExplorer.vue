<template>
  <div class="project flex flex-col justify-between h-full pb-2 bg-gray-100 w-64">

    <LvToolbarContainer>
      <slot name="toolbar"/>
    </LvToolbarContainer>

    <div class="flex flex-col justify-between flex-1">
      <div class="flex-1">

        <div class="h-box flex-limit items-center p-4 font-bold">
          {{ title }}
        </div>

        <slot/>
      </div>
    </div>
  </div>
</template>

<script setup>
import LvToolbarContainer from '../styled/LvToolbarContainer.vue';
import { useSlots } from 'vue';
import { useLocalize } from '@crhio/leviate';

const slots = useSlots();
const props = defineProps({
  title: String,
});
const { $L } = useLocalize();

const title = slots.title || props.title || $L('project_explorer');
</script>
