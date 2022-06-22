<style scoped lang="scss">
  .menu {
    min-height: 3rem;
  }

</style>

<template>
  <div class="menu h-box flex-limit justify-between border-b">
    <c-toolbar>
      <c-tool-group>
        <c-tool
          name="Undo"
          tool-id="undo"
          icon="undo"
          :stateful="false"
          @click="undo"
          :disabled="!undoable"
        />
        <c-tool
          name="Redo"
          tool-id="redo"
          icon="redo"
          :stateful="false"
          @click="redo"
          :disabled="!redoable"
        />
      </c-tool-group>
    </c-toolbar>
    <c-toolbar>
      <c-tool-group>
        <c-tool name="Export" tool-id="export" icon="file-export" :stateful="false" @click="openExport" />
        <c-tool name="Settings" tool-id="settings" :stateful="false" @click="openSettings">
          <settings-icon />
        </c-tool>
      </c-tool-group>
    </c-toolbar>
    <settings-modal ref="settings" />
    <export-modal ref="export" />
  </div>
</template>

<script>
import { useRootStore } from '@crhio/leviate/store/index';
import SettingsIcon from '@crhio/leviate/assets/icons/cog.svg';
import SettingsModal from './settings-modal.vue';
import ExportModal from './export-modal.vue';


export default {
  name: 'explorer-toolbar',
  components: {
    SettingsIcon,
    SettingsModal,
    ExportModal,
  },
  computed: {
    revision() {
      return useRootStore().revision;
    },
    undoable() {
      return this.revision.undoable;
    },
    redoable() {
      return this.revision.redoable;
    },
  },
  methods: {
    undo() {
      this.revision.undo();
    },
    redo() {
      this.revision.redo();
    },
    openExport() {
      this.$refs.export.open();
    },
    openSettings() {
      this.$refs.settings.open();
    },
  },
};
</script>
