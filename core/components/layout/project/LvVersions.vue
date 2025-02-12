<template>
  <div class="flex flex-col h-full justify-between px-4 pb-4 pt-2" >
    <div class="h-full">
        <div v-for="(version,i) in versions" :key="version.id"
             class="py-2 mb-2 border-b border-base-300 last:border-b-0"
             :class="rootVersionId !== version.id && 'ml-3'"
        >
          <div class="flex justify-between">
            <LvEditableDiv class="outline-none flex-1 mr-4"
                           :class="[
                             version.id === activeVersionId && 'font-bold',
                             editId === version.id ? 'ring-2 ring-offset-2 ring-offset-base-50' : 'cursor-pointer'
                           ]"
                           @click="onClick(version.id)"
                           :is-editable="editId === version.id"
                           :model-value="version.name"
                           @update:modelValue="updateVersion(version.id, $event)"
                           @blur="editId = null"
                           autofocus
            />

            <div>
              <button @click="editId = version.id" class="p-0.5 rounded outline-none hover:text-base-950 text-base-700">
                <CIcon type="edit" size="sm" />
              </button>
              <button @click="onDuplicate(version.id)" class="p-0.5 rounded outline-none hover:text-base-950 text-base-700">
                <CIcon type="copy" size="sm"/>
              </button>
              <button v-if="rootVersionId !== version.id" @click="deleteVersion(version.id)" class="p-0.5 rounded outline-none hover:text-base-950 text-base-700">
                <CIcon type="trash" size="sm"/>
              </button>
            </div>
          </div>
          <div class="flex justify-end text-xs text-base-600">Created: {{new Date(version.createdAt).toDateString() }}</div>
        </div>
    </div>

    <div class="flex flex-1  flex-row">
      <CTextInput :placeholder="$l('create_a_new_version')" v-model="configNameInputVal" class="mr-2" @keydown.enter="onSaveNewVersion"/>
      <CButton class="w-24" @click="onSaveNewVersion">{{ $L('save') }}</CButton>
    </div>

    <component v-if="!isProduction && devToolsComponent" :is="devToolsComponent" />
  </div>
</template>

<script setup>
import { markRaw, ref } from 'vue';
import useVersions from '@crhio/leviate/composables/useVersions';
import LvEditableDiv from '@crhio/leviate/components/ui/LvEditableDiv.vue';

const isProduction = import.meta.env.PROD;
const devToolsComponent = ref();

if (!isProduction) {
  import('@crhio/leviate/components/layout/project/LvVersionsDev.vue').then(module => {
    devToolsComponent.value = markRaw(module.default);
  })
}

const configNameInputVal = ref('');

const {
  versions,
  activeVersionId,
  getVersionById,
  loadVersion,
  createVersion,
  deleteVersion,
  rootVersionId,
  setName,
} = useVersions();

const editId = ref(null);

function onClick(id) {
  if (editId.value !== id) loadVersion(id);
}

function onSaveNewVersion() {
  const configName = configNameInputVal.value;

  if (!configName) return;

  configNameInputVal.value = '';
  createVersion(configName);
}

const onDuplicate = (id) => {
  const name = 'Copy of ' + getVersionById(id).name;
  createVersion(name, id);
}

const updateVersion = (versionId, name) => {
  setName(name, versionId);
  editId.value = null;
};

</script>
