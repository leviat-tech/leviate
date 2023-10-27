<template>
  <div class="flex flex-col h-full justify-between p-4" >
    <div class="flex-1">
        <div v-for="version in versions" :key="version.id"
             class="p-2 mb-2 border-b border-indigo-lightest last:border-b-0"
             :class="rootVersionId !== version.id && 'ml-3'"
        >
          <div class="flex justify-between">
            <div class="cursor-pointer"
              :class="version.id === activeVersionId && 'font-bold'"
              ref="inputRef"
              @click="loadVersion(version.id)"
              :contenteditable="isEditing"
            >
                {{version.name}}
            </div>
            <div class="" >
              <!-- Add edit button. Autofocus editable div and call host.setName on enter and blur -->
              <button class="mr-2"><CIcon type="copy" size="sm" @click="onDuplicate(version.id)"/></button>
              <button  v-if="rootVersionId !== version.id" class="w-4 h-4" @click="deleteVersion(version.id)">
                <CIcon type="trash" size="sm"/>
              </button>
            </div>
          </div>
          <div class="flex justify-end text-[12px] text-steel-dark">Created: {{version.createdAt}}</div>
        </div>
    </div>

    <div class="flex flex-1  flex-row">
      <input placeholder="Create a new version" v-model="configNameInputVal" class="mr-4 p-2 border" @keydown.enter="onSave"/>
      <CButton class="w-24" @click="onSave">Save</CButton>
    </div>

    <LvVersionsDev />
  </div>
</template>

<script setup>
import { nextTick, ref } from 'vue';
import useVersions from '@crhio/leviate/composables/useVersions.js';
import LvVersionsDev from '@crhio/leviate/components/layout/project/LvVersionsDev.vue';

const configNameInputVal = ref('');

const {
  versions,
  activeVersionId,
  getVersionById,
  loadVersion,
  createVersion,
  deleteVersion,
  rootVersionId,
} = useVersions();

const isEditing = ref(false);
const inputRef = ref(null);

async function onSave() {
  const configName = configNameInputVal.value;

  if (!configName) return;

  createVersion(configName);
  configNameInputVal.value = '';
}

const onDuplicate = async (id) => {
  const name = 'Copy of ' + getVersionById(id).name;
  createVersion(name, id);
}

const onEdit = async () => {
  if (isEditing.value) return;
  isEditing.value = true;
  await nextTick();
  const input = inputRef.value;
};
</script>
