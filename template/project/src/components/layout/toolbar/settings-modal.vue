<style scoped lang="scss">
</style>


<template>
  <c-modal v-if="showModal" title="Settings" @close="close" size="lg">
    <div class="space-y-4">

      <div class="flex justify-between space-x-8">
        <div class="py-1">Config Name</div>
        <div class="w-64">
          <c-text-input v-model="localConfigName" />
        </div>
      </div>

      <div class="flex justify-between space-x-8">
        <div class="py-1">Language</div>
        <div class="w-64">
          <c-text-input :disabled="true" :value="locale" />
        </div>
      </div>

      <div class="flex justify-between space-x-8">
        <div class="py-1">Client Notes</div>
        <div class="w-64">
          <c-textarea v-model="localClientNotes" :rows="4" />
        </div>
      </div>

      <div class="flex justify-between space-x-8">
        <div class="py-1">Internal Notes</div>
        <div class="w-64">
          <c-textarea v-model="localInternalNotes" :rows="4" />
        </div>
      </div>

      <div class='flex space-x-8 mt-8'>
        <button class="btn secondary w-full" @click="reset">
          Reset
        </button>
        <button class="btn secondary w-full" @click="save">
          Save
        </button>
      </div>

      <div class='flex'>
        <button class="btn secondary w-full" @click="debug">
          Debug
        </button>
      </div>
    </div>
  </c-modal>
</template>


<script>
import { mapWritableState } from 'pinia';
import { useSettingsStore } from '@crhio/leviate/store/settings';

export default {
  name: 'tool-settings',
  data: () => ({
    localConfigName: '',
    localClientNotes: '',
    localInternalNotes: '',
    showModal: false,
  }),
  methods: {
    open() {
      this.showModal = true;
      this.localConfigName = this.configName;
      this.localClientNotes = this.clientNotes;
      this.localInternalNotes = this.internalNotes;
    },
    close() {
      this.showModal = false;
    },
    save() {
      this.clientNotes = this.localClientNotes;
      this.internalNotes = this.localInternalNotes;
      if (this.configName !== this.localConfigName) {
        this.setName();
      }
      this.close();
    },
    async setName() {
      this.$host.setName(this.localConfigName);
      this.configName = this.localConfigName;
    },
    // is this necessary?
    reset() {
      this.clientNotes = '';
      this.internalNotes = '';
    },
    debug() {},
  },
  computed: {
    ...mapWritableState(useSettingsStore, ['configName', 'clientNotes', 'internalNotes']),
  },
};

</script>
