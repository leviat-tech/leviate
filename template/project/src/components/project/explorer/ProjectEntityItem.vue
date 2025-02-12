<template>
  <li class="project__entity-item border-b h-9 flex justify-between bg-white text-xs">
    <router-link :to="getItemRoute(item.id)" class="flex space-x-3 w-full">
      <div class="w-2 h-9" :class="{ 'bg-transparent' : !isActive, 'bg-brand-500' : isActive }"></div>
      <div v-if="['none', null].includes(item.entityStatus) == false" class="w-4 h-4 rounded-full my-auto" :class="dotClass"></div>
      <div
        ref="inputRef"
        class="flex items-center outline-none"
        :contenteditable="isEditing"
        @keydown.enter.prevent="onEnter"
        @blur="onBlur"
      >
        {{ item.name }}
      </div>
    </router-link>
    <div class="project__entity-item-buttons flex items-center px-3 space-x-1">
      <ProjectEntityItemButton @click="onEdit" icon="edit" :title="$L('edit')" />
      <ProjectEntityItemButton @click="onClone" icon="copy" :title="$L('clone')" />
      <ProjectEntityItemButton @click="onDelete" icon="trash" :title="$L('delete')" />
    </div>
  </li>

</template>

<script setup>
import { computed, nextTick, ref } from 'vue';
import { omit } from 'lodash-es';
import { useRoute, useRouter } from 'vue-router';
import ProjectEntityItemButton from './ProjectEntityItemButton.vue';
import { transact } from '@crhio/leviate';

const router = useRouter();
const route = useRoute();

const props = defineProps({
  item: Object,
});
const { item } = props;
const model = item.constructor;

const isEditing = ref(false);
const inputRef = ref(null);
const isActive = computed(() => route.params.id === item.id);

const getItemRoute = (itemId) => `/entities/${model.id}/${itemId}`;

const dotClass = computed(() => {
  return {
    none: '',
    unknown: 'bg-status-unknown',
    success: 'bg-status-success',
    warning: 'bg-status-warning',
    magic: 'bg-status-magic',
    danger: 'bg-status-danger',
  }[item.entityStatus || 'none']
}); 

const onEdit = async () => {
  if (isEditing.value) return;

  isEditing.value = true;

  await nextTick();

  const input = inputRef.value;
  // TODO: move cursor to end of input
  input.focus();
};

const onEnter = () => {
  inputRef.value.blur();
};

const onBlur = () => {
  item.name = inputRef.value.innerHTML;
};

const onClone = () => {
  transact(() => {
    const newData = omit(item.$toJSON(), ['id', 'name']);
    const newItem = model.create(newData);

    router.push(getItemRoute(newItem.id));
  });
};

const onDelete = () => {
  transact(() => {
    item.$delete();
  })
};

</script>
