<style scoped lang="scss">
  .host-bar {
    position: relative;
    padding: 30px;
    color: white;
    background: #3c3f48;
    width: 256px;
  }
  .host-nav {
    color: #94979e;
    background: #f5f5f5;
    border-bottom: 1px solid #dfe0e3;
    height: 48px;
    padding: 12px;
    z-index: 10;
  }
  .host-container {
    overflow-y: auto;
    padding-top: 48px;
    margin-top: -48px;
  }

  .dev__ui {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;

    button {
      &.active {
        font-weight: bold;
      }
    }

    .dev__buttons button {
      transition: 1s;

      &.highlight {
        transition: none;
        background-color: lighten($primary, 20);
      }
    }
  }
</style>

<template>
  <!-- provide a little host like context -->
  <div class="h-full flex flex-row">
    <div class="host-bar text-center flex flex-col justify-between">
      <div class="flex-grow">TECH STUDIO</div>

      <div class="dev__ui text-left">
        <div class="mx-2">

          <div class="mb-3 pb-3 border-b" v-if="configurations.length > 0">
            <div class="text-lg mb-4 pb-2 border-b">Saved Configurations</div>
            <div v-for="name in configurations">
              <div class="flex items-center mb-2 px-2">
                <div class="w-1 h-6 bg-gray-600 mr-2"
                     :class="{ 'bg-green-600': name === currentConfig }" />
                <button class="flex-grow text-left"
                        :class="{ active: name === currentConfig }"
                        @click="restoreConfiguration(name)">{{ name }}
                </button>
                <button class="flex items-center justify-center bg-gray-500 w-6 h-6" @click="deleteConfiguration(name)">
                  <c-icon type="trash" size="md"></c-icon>
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
              <c-button class="w-full btn__save" @click="onSave" :class="{ 'highlight': saveTrigger }">Save</c-button>
            </div>
            <div class="w-1/2 pl-1">
              <c-button class="w-full" @click="onClear">Clear</c-button>
            </div>
          </div>

        </div>
      </div>
    </div>
    <div class="h-full w-full flex flex-col">
      <div class="host-nav">
        Projects > New Project > Item
      </div>
      <div class="host-container relative h-full">
        <application></application>
      </div>
    </div>
  </div>
</template>

<script>
import App from './app.vue';
import uniq from 'lodash/uniq'
import debounce from 'lodash/debounce'

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
      return this.$host.getMeta().configurator.name;
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
