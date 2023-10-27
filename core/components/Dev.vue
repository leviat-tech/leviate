<style scoped>
.host-bar {
  width: 256px;
}

.host-nav {
  color: #94979e;
  background: #f5f5f5;
  border-bottom: 1px solid #dfe0e3;
}
</style>

<template>
  <!-- provide a little host like context -->
  <div class="h-full flex flex-row">
    <div class="host-bar relative p-6 text-white text-center flex flex-col bg-gradient-to-b from-indigo to-indigo-darkest">
      <img src="../assets/images/leviat-logo.png" class="w-32">

      <div class="text-left">
        <div class="text-xl opacity-50 my-4">DEVELOPMENT</div>
        {{ $host.getMeta().configurator.name }}
      </div>

      <div class="dev__ui absolute bottom-0 left-0 w-full text-left">
        <div class="mx-2">
<!---->
          <div class="mb-3 pb-3 border-b" v-if="settings.configurations.length > 0">
            <div class="text-lg mb-4 pb-2 border-b">Saved Configurations</div>
            <div v-for="{ configName: name } in settings.configurations">
              <div class="flex items-center mb-2 px-2">
                <div class="w-1 h-6 bg-gray-600 mr-2" :class="{ 'bg-green-600': name === settings.currentConfig }" />
                <button class="flex-grow text-left" :class="{ 'font-bold': name === settings.currentConfig }"
                  @click="onLoad(name)">{{ name }}
                </button>
                <button class="flex items-center justify-center bg-gray-500 w-6 h-6" @click="deleteConfiguration(name)">
                  <CIcon type="trash" size="md" />
                </button>
              </div>
            </div>
          </div>
<!---->
          <div class="flex items-center justify-between">
            <label for="dev__autosave" class="flex-grow py-2 cursor-pointer">Autosave</label>
            <input id="dev__autosave" type="checkbox" v-model="settings.autosave" />
          </div>
<!---->
          <input class="w-full px-2 py-2 text-black outline-none text-sm" v-model="configNameInputVal"
            @keydown.enter="onSave" placeholder="Save as">
<!---->
          <div class="dev__buttons flex my-3">
            <div class="w-1/2 pr-1">
              <CButton class="w-full  transition duration-150 btn__save" color="sky" @click="onSave">Save</CButton>
            </div>
            <div class="w-1/2 pl-1">
              <CButton class="w-full transition duration-150" color="sky" @click="onClear">Clear</CButton>
            </div>
          </div>
          <div class="dev__buttons flex my-3">
            <div class="w-1/2 pr-1">
              <label>
                <input @change="onRestoreFromFile" type="file" ref="uploadfile" hidden />
                <CButton class="w-full  transition duration-150 btn__upload" color="sky" @click="$refs.uploadfile.click()">Restore
                </CButton>
              </label>
            </div>
            <div class="w-1/2 pl-1">
              <CButton class="w-full  transition duration-150 btn__download" color="sky" @click="onDownLoadFile">Backup
              </CButton>
            </div>
          </div>
<!---->
        </div>
      </div>
    </div>
    <div class="h-full w-full flex flex-col">
      <div class="host-nav h-12 p-3 border-b">
        Projects > New Project > Item
      </div>
      <div class="host-container relative h-full">
        <App />
      </div>
    </div>
  </div>
</template>

<script setup>
import App from './App.vue';
import { useHost } from '../plugins/host';
import { useMock } from '../host-mock.js';
import { ref, toRefs } from 'vue';
import { useRootStore } from '../store';

const $host = useHost();
const store = useRootStore();
const {
  settings,
  loadConfiguration,
  saveConfiguration,
  deleteConfiguration,
  clearStorage,
  localStorageBackup,
} = useMock();

const configNameInputVal = ref('');

const state = $host.getState();

async function onSave() {
  const configName = configNameInputVal.value;
  const newState = store.toJSON();

  saveConfiguration(configName, newState);

  configNameInputVal.value = '';
}

async function onDownLoadFile() {
  const appname = $host.getMeta().configurator.name;
  localStorageBackup(appname);
}

function onRestoreFromFile(e) {
  const f = e.target.files[0]
  if (f) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var text = e.target.result;
      var backup = JSON.parse(text);
      for (var key in backup) {
        var value = decodeURIComponent(unescape(backup[key]));
        window.localStorage.setItem(key, value);
      }
    };
    reader.readAsText(f);
  } else {
    alert('Failed to load file');
  }

  window.location.reload();
}

function onLoad(name) {
  const newState = loadConfiguration(name);

  store.replaceState(newState);
}

async function onClear() {
  document.querySelector('body').style.opacity = 0.5;
  setTimeout(clearStorage);
}
</script>
