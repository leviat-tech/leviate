<template>
  <CAccordion default-open>

    <template #title="{ open }">
      <div class="flex items-center justify-stretch p-4 pb-2 rotate-90">
        <CIcon type="chevron-right" size="sm" :class="open && 'transition transform rotate-90'"/>
        <div class="font-bold ml-2 flex-grow capitalize">{{ model.id }}</div>
        <button title="Add" @click.stop="addItem">
          <CIcon type="plus" size="sm"></CIcon>
        </button>
      </div>
    </template>

    <ul class="border-t">
      <LvProjectEntityItem v-for="item in items" :item="item" :key="item.id"></LvProjectEntityItem>
    </ul>

  </CAccordion>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import LvProjectEntityItem from './LvProjectEntityItem.vue';

const router = useRouter();

const props = defineProps({
  model: Function,
});

const items = computed(() => props.model.read());

const addItem = () => {
  const { model } = props;
  const newItem = model.create();

  router.replace(`/entities/${model.id}/${newItem.id}`);
}



</script>
