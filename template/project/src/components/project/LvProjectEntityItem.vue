<template>
  <div class="project__entity-item flex border-b p-2 pl-4 bg-white">

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

    <div class="project__entity-item-buttons flex opacity-70 space-x-1">
      <button @click="onEdit">
        <c-icon type="edit" size="sm"></c-icon>
      </button>

      <button @click="onClone">
        <c-icon type="copy" size="sm"></c-icon>
      </button>

      <button @click="onDelete">
        <c-icon type="trash" size="sm"></c-icon>
      </button>
    </div>

  </div>

</template>

<script setup>
import { nextTick, ref } from 'vue';
import { omit } from 'lodash-es';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  item: Object
});
const { item } = props;
const model = item.constructor;

const isEditing = ref(false);
const inputRef = ref(null);

const getItemRoute = (itemId) => `/entity/${model.id}/${itemId}`;

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
