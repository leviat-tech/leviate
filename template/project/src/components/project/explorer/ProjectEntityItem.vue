<template>
  <li class="project__entity-item flex border-b p-2 pl-4 bg-white" :class="isActive && 'bg-gray-100 text-indigo'">

    <router-link :to="getItemRoute(item.id)" class="flex-1">
      <div
        ref="inputRef"
        class="outline-none"
        :contenteditable="isEditing"
        @keydown.enter.prevent="onEnter"
        @blur="onBlur"
      >
        {{ item.name }}
      </div>
    </router-link>

    <div class="project__entity-item-buttons flex space-x-1" :class="isActive || 'text-gray-500'">
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

const router = useRouter();
const route = useRoute();

const props = defineProps({
  item: Object,
});
const { item } = props;
const model = item.constructor;

const isEditing = ref(false);
const inputRef = ref(null);
const isActive = computed(() => useRoute().params.id === item.id);

const getItemRoute = (itemId) => `/entities/${model.id}/${itemId}`;

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
  const newData = omit(item.$toJSON(), ['id', 'name']);
  const newItem = model.create(newData);

  router.push(getItemRoute(newItem.id));
};

const onDelete = () => {
  item.$delete();
};

</script>
