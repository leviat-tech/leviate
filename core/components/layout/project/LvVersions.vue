<template>
  <div class="flex flex-col h-full justify-between p-4" >
    <div class="flex-1">
        <div v-for="version in versions" :key="version.id" class="p-2 mb-2 border-b border-indigo-light">
          <div class="flex justify-between">
            <div class="">{{version.name}}</div>
            <div class="" >
              <button class="mr-2"><CIcon type="copy" size="sm" /></button>
               <button class="w-4 h-4" @click="deleteVersion(version.name)">
                  <CIcon type="trash" size="sm" />
                </button>
            </div>
          </div>
          <div class="flex justify-end text-[12px] text-steel-dark">Created: {{version.createdAt}}</div>
        </div>
    </div>
    <div class="flex flex-1  flex-row">
      <input  placeholder="Create a new version" v-model="configNameInputVal" class="mr-4 p-2 border" />
      <CButton class="w-24" @click="onSave()">Save</CButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import { useMock } from '../../../host-mock.js';
import { useRootStore } from '../../../store';
import { useRoute } from 'vue-router';

const fromId = useRoute().params.id

const configNameInputVal = ref('');
const store = useRootStore();
const {
  settings,
  getVersions,
  createVersion,
  deleteVersion,
  clearStorage,
  localStorageBackup,
} = useMock();


async function onSave() {
  const configName = configNameInputVal.value;
  //const newState = store.toJSON();
  createVersion(configName, fromId);
  configNameInputVal.value = '';
}


const versions = ref(
  [
  {
    "id": 4,
    "createdAt": "2023-10-16T12:55:39.601Z",
    "name": "test",
    "number": "123",
    "ownerId": 1,
    "projectId": 1,
    "customerId": 1,
    "configuratorId": 3,
    "parentId": 1,
    "state": {}
  },
  {
    "id": 5,
    "createdAt": "2023-10-16T12:56:19.682Z",
    "name": "test",
    "number": "123",
    "ownerId": 1,
    "projectId": 1,
    "customerId": 1,
    "configuratorId": 3,
    "parentId": 1,
    "state": {}
  }
]
)

</script>
