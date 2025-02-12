<template>
  <CAccordion default-open>

    <template #title="{ open }">
      <div class="flex justify-between px-2 py-2 border-b text-xs">
        <div class="flex space-x-4">
          <CIcon type="chevron-right" size="sm" :class="open && 'transform rotate-90'"/>
          <div class="flex items-center font-bold capitalize">{{ $L(model.id) }}</div>
        </div>
        <button title="Add" @click.stop="addItem">
          <CIcon type="plus" size="sm"></CIcon>
        </button>
      </div>
    </template>

    <ul class="">
      <ProjectEntityItem v-for="item in items" :item="item" :key="item.id"></ProjectEntityItem>
    </ul>

  </CAccordion>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { transact } from '@crhio/leviate';
import ProjectEntityItem from './ProjectEntityItem.vue';

const router = useRouter();

const props = defineProps({
  model: Function,
});

const items = computed(() => props.model.read());

const addItem = () => {
  const { model } = props;

  transact(() => {
    const newItem = model.create();

    router.replace(`/entities/${model.id}/${newItem.id}`);
  });
};


</script>
