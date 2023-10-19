<template>
  <div class="flex flex-col h-full justify-between p-4" >
    <div class="flex-1">
        <div v-for="version in versions" :key="version.id" class="p-2 mb-2 border-b border-indigo-light">
          <div class="flex justify-between">
            <div class="">{{version.name}}</div>
            <div class="" >
              <button class="mr-2"><CIcon type="copy" size="sm" /></button>
              {{ version.id }}
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
import { ref } from 'vue';
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
} = useHost();


async function onSave() {
  const configName = configNameInputVal.value;
  createVersion(configName);
  configNameInputVal.value = '';
  versions.value = await getVersions(false);
}

async function onDelete(id) {
  deleteVersion(id);
  versions.value = await getVersions(false);
}

const versions = ref(getVersions(false))
</script>
