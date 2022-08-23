<style scoped lang="scss">
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
    <div class="host-bar relative p-6 text-white text-center flex flex-col bg-indigo">
      <img src="../assets/images/leviat-logo.png" class="w-32">

      <div class="text-left">
        <div class="text-xl opacity-50 my-4">DEVELOPMENT</div>
        {{ $host.getMeta().configurator.name }}
      </div>

      <div class="dev__ui absolute bottom-0 left-0 w-full text-left">
        <div class="mx-2">

          <div class="mb-3 pb-3 border-b" v-if="configurations.length > 0">
            <div class="text-lg mb-4 pb-2 border-b">Saved Configurations</div>
            <div v-for="name in configurations">
              <div class="flex items-center mb-2 px-2">
                <div class="w-1 h-6 bg-gray-600 mr-2"
                     :class="{ 'bg-green-600': name === currentConfig }" />
                <button class="flex-grow text-left"
                        :class="{ 'font-bold': name === currentConfig }"
                        @click="restoreConfiguration(name)">{{ name }}
                </button>
                <button class="flex items-center justify-center bg-gray-500 w-6 h-6" @click="deleteConfiguration(name)">
                  <CIcon type="trash" size="md" />
                </button>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <label for="dev__autosave" class="flex-grow py-2 cursor-pointer">Autosave</label>
            <input id="dev__autosave" type="checkbox" v-model="autosave" />
          </div>

          <input class="w-full px-2 py-2 text-black outline-none text-sm"
                 v-model="configNameInputVal"
                 @keydown.enter="onSave"
                 placeholder="Save as">

          <div class="dev__buttons flex my-3">

            <div class="w-1/2 pr-1">
              <CButton class="w-full  transition duration-150 btn__save" color="sky" @click="onSave">Save</CButton>
            </div>
            <div class="w-1/2 pl-1">
              <CButton class="w-full transition duration-150" color="sky" @click="onClear">Clear</CButton>
            </div>
          </div>

        </div>
      </div>
    </div>
    <div class="h-full w-full flex flex-col">
      <div class="host-nav h-12 p-3 z-10 border-b">
        Projects > New Project > Item
      </div>
      <div class="host-container relative h-full overflow-y-scroll pt-12 -mt-12">
        <App />
      </div>
    </div>
  </div>
</template>

<script setup>
import App from './App.vue';
import { uniq, debounce } from 'lodash-es'
import { useHost } from '../plugins/host';
import { nextTick, onBeforeMount, reactive, toRefs, watch } from 'vue';
import { useRootStore } from '../store';

const $host = useHost();
const store = useRootStore();

let unsubscribe = () => {};

const state = reactive({
  configNameInputVal: null,
  autosave: false,
  configurations: [],
  currentConfig: '',
});

const {
  configNameInputVal,
  autosave,
  configurations,
  currentConfig,
} = toRefs(state);

const stateKey = $host.getMeta().configurator.name;

onBeforeMount(() => {
  const storedSettings = getStorageItem('settings');

  if (storedSettings) {
    Object.assign(state, storedSettings);
    restoreConfiguration(storedSettings.currentConfig);
  }

  subscribe();
})

watch(autosave, (val) => {
  val ? subscribe() : unsubscribe();
});


async function onSave() {
  saveConfiguration();
  state.configNameInputVal = '';
}

async function onClear() {
  document.querySelector('body').style.opacity = 0.5;
  setTimeout(clearStorage);
}

function saveConfiguration(name) {
  const configName = name || state.configNameInputVal || state.currentConfig || 'Default';
  state.configurations = uniq([
    ...state.configurations,
    configName
  ]);
  saveSettings();
  setStorageItem(configName, store.toJSON());
  setCurrentConfig(configName);

  console.log(`Configuration '${configName}' saved`);
}

async function restoreConfiguration(name = 'Default') {
  unsubscribe()

  await nextTick();

  const state = getStorageItem(name);

  if (!state) return;

  setCurrentConfig(name);
  store.replaceState(state);

  subscribe();
}

function deleteConfiguration(name) {
  state.configurations = state.configurations.filter(configuration => configuration !== name);
  saveSettings();
  removeStorageItem(name);
}

function clearStorage() {
  const deleteKeys = [];

  // Only clear storage for this app
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.slice(0, stateKey.length) === stateKey) {
      deleteKeys.push(key);
    }
  }

  deleteKeys.forEach(key => localStorage.removeItem(key));

  window.location.reload();
}

function getStorageKey(name = 'Default') {
  return [stateKey, name].join(':');
}

function getStorageItem(name) {
  const key = getStorageKey(name);
  const storedJSON = localStorage.getItem(key);

  try {
    return JSON.parse(storedJSON);
  } catch(e) {
    console.log(`Cannot get item: '${key}'`, e);
  }
}

function setCurrentConfig(name) {
  state.currentConfig = name;
  saveSettings();
}

function setStorageItem(name, data) {
  const key = getStorageKey(name);
  localStorage.setItem(key, JSON.stringify(data));
}

function removeStorageItem(name) {
  const key = getStorageKey(name);
  localStorage.removeItem(key);
}

function saveSettings() {
  const settings = {
    autosave: state.autosave,
    configurations: state.configurations,
    currentConfig: state.currentConfig
  }
  setStorageItem('settings', settings);
}

function subscribe() {
  if (state.autosave) {
    unsubscribe = store.$subscribe(debounce(() => {
      saveConfiguration(state.currentConfig);
    }, 1000));
  }
}
</script>
