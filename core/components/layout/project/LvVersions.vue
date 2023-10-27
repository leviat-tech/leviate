<template>
  <div class="flex flex-col h-full justify-between p-4" >
    <div class="flex-1">
      <!-- Display root version -->

        <div v-for="version in versions" :key="version.id"
             class="p-2 mb-2 border-b border-indigo-light"
        >
          <div class="flex justify-between">
            <div class="cursor-pointer"
              :class="version.id === activeVersionId && 'font-bold'"
              ref="inputRef"
              @click="onLoad(version.id)"
              :contenteditable="isEditing"
            >
                {{version.name}}
            </div>
            <div class="" >
              <!-- Add edit button. Autofocus editable div and call host.setName on enter and blur -->
              <button class="mr-2"><CIcon type="copy" size="sm" @click="onDuplicate(version.id)"/></button>
              <button class="w-4 h-4" @click="onDelete(version.id)">
                <CIcon type="trash" size="sm" />
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
  </div>
</template>

<script setup>
import { ref, nextTick, computed } from 'vue';
import { useHost } from '@crhio/leviate';
import { useRootStore } from '../../../store';
import { useRoute } from 'vue-router';

const fromId = useRoute().params.id

const configNameInputVal = ref('');
const store = useRootStore();
const {
  getVersions,
  createVersion,
  deleteVersion,
  getConfiguration,
  loadConfiguration
} = useHost();

const isEditing = ref(false);
const inputRef = ref(null);

const getVersionById = (id) => {
  return versions.value.find(version => version.id === id)
}

async function onSave() {
  const configName = configNameInputVal.value;
  if (configName){
    const fromId = activeVersionId.value;
    createVersion(configName, fromId);
    configNameInputVal.value = '';
    versions.value = await getVersions(false);

    // TODO: set new version as active
  }
}

const onDuplicate = async (id) => {
  const name = 'Copy of ' + getVersionById(id).name;
  createVersion(name, id);
  versions.value = await getVersions(false);
}

async function onDelete(id) {
  console.log(id)
  deleteVersion(id);
  versions.value = await getVersions(false);
}

const versions = ref(getVersions(true));
const activeVersionId = ref(getConfiguration().id);

const onEdit = async () => {
  if (isEditing.value) return;
  isEditing.value = true;
  await nextTick();
  const input = inputRef.value;
};

const onLoad = async (id) => {
  const newState = await loadConfiguration(id);
  // TODO: fix panel tab minimising when loading new version
  store.replaceState(newState);
  activeVersionId.value = id;
}
</script>
