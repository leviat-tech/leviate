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
      <img src="./assets/images/leviat-logo.png" class="w-32">

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
                  <CIcon type="trash" size="md"></CIcon>
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
              <CButton class="w-full  transition duration-150 btn__save" color="sky" click="onSave" :class="{ 'highlight': saveTrigger }">Save</CButton>
            </div>
            <div class="w-1/2 pl-1">
              <CButton class="w-full transition duration-150" color="sky" click="onClear">Clear</CButton>
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
        <application></application>
      </div>
    </div>
  </div>
</template>

<script>
import App from './app.vue';
import { uniq, debounce } from 'lodash-es'

export default {
  name: 'Dev',
  components: {
    application: App,
  },
  data() {
    return {
      unsubscribe: () => {},
      configNameInputVal: null,
      autosave: false,
      configurations: [],
      currentConfig: '',
      saveTrigger: false
    }
  },
  computed: {
    stateKey() {
      // return this.$host.getMeta().configurator.name;
    },
  },
  created() {
    const storedSettings = this.getStorageItem('settings');

    if (storedSettings) {
      Object.assign(this, storedSettings);
      this.restoreConfiguration(storedSettings.currentConfig);
    }

    this.subscribe();
  },
  methods: {
    async onSave() {
      this.saveTrigger = true;
      this.saveConfiguration();
      this.configNameInputVal = '';

      setTimeout(() => { this.saveTrigger = false });
    },
    async onClear() {
      document.querySelector('body').style.opacity = 0.5;
      setTimeout(this.clearStorage);
    },
    saveConfiguration(name) {
      const configName = name || this.configNameInputVal || this.currentConfig || 'Default';
      this.configurations = uniq([
        ...this.configurations,
        configName
      ]);
      this.saveSettings();
      this.setStorageItem(configName, this.$store.state);
      this.setCurrentConfig(configName);

      console.log(`Configuration '${configName}' saved`);
    },
    async restoreConfiguration(name = 'Default') {
      this.unsubscribe()

      await this.$nextTick();

      const state = this.getStorageItem(name);

      if (!state) return;

      this.setCurrentConfig(name);
      this.$store.replaceState(state);

      this.subscribe();
    },
    deleteConfiguration(name) {
      this.configurations = this.configurations
          .filter(configuration => configuration !== name);
      this.saveSettings();
      this.removeStorageItem(name);
    },
    clearStorage() {
      const deleteKeys = [];

      // Only clear storage for this app
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.slice(0, this.stateKey.length) === this.stateKey) {
          deleteKeys.push(key);
        }
      }

      deleteKeys.forEach(key => localStorage.removeItem(key));

      window.location.reload();
    },
    getStorageKey(name = 'Default') {
      return [this.stateKey, name].join(':');
    },
    getStorageItem(name) {
      const key = this.getStorageKey(name);
      const storedJSON = localStorage.getItem(key);

      try {
        return JSON.parse(storedJSON);
      } catch(e) {
        console.log(`Cannot get item: '${key}'`, e);
      }
    },
    setCurrentConfig(name) {
      this.currentConfig = name;
      this.saveSettings();
    },
    setStorageItem(name, data) {
      const key = this.getStorageKey(name);
      localStorage.setItem(key, JSON.stringify(data));
    },
    removeStorageItem(name) {
      const key = this.getStorageKey(name);
      localStorage.removeItem(key);
    },
    saveSettings() {
      const settings = {
        autosave: this.autosave,
        configurations: this.configurations,
        currentConfig: this.currentConfig
      }
      this.setStorageItem('settings', settings);
    },
    subscribe() {
      if (this.autosave) {
        this.unsubscribe = this.$store.subscribe(debounce(() => {
          this.saveConfiguration(this.currentConfig);
        }, 1000));
      }
    }
  },
  watch: {
    autosave(val) {
      val ? this.subscribe() : this.unsubscribe();
    }
  }
};
</script>
