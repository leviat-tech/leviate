
<template>
  <div :class="{ 'flex-1 flex flex-col' : isActive }" class="bg-base-50 transition-all duration-300 ease-in">
    <div 
      @click="onClick(name)"
      @keydown.enter="onClick(name)"
      :data-cy="`project__${name}`"
      class="px-4 py-3 cursor-pointer text-sm"
      :class="{ 'bg-white hover:bg-base-50' : !isActive, 'bg-[#FAFCFC] text-black font-semibold border-t-2 border-brand-500' : isActive }"
    >
      <div>{{ $L(`project_${name}`) }}</div>
    </div>
    <div v-if="isActive" class="bg-[#FAFCFC] flex-1 relative">
      <div class="h-full overflow-y-auto absolute w-full text-sm py-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-base-100 [&::-webkit-scrollbar-thumb]:bg-base-400">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLeviateStore } from '../../../store/leviate.js';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  name: String,
});

const router = useRouter();
const leviate = useLeviateStore();

const isActive = computed(() => leviate.panels.project.activeItem === props.name);

function onClick(name) {
  if (isActive.value) return;
  leviate.setActiveProjectItem(name);
  router.replace({ query: { projectTab: name } });
}
</script>
