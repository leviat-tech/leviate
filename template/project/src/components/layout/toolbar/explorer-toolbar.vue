<style scoped lang="scss">
  .menu {
    border-bottom: $border;
    min-height: $toolbar-height;
  }

</style>

<template>
  <div class="menu h-box flex-limit justify-between">
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
import SettingsIcon from 'leviate/assets/icons/cog.svg';
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
    undoable() {
      return this.$store.revision.undoable;
    },
    redoable() {
      return this.$store.revision.redoable;
    },
  },
  methods: {
    undo() {
      this.$store.revision.undo();
    },
    redo() {
      this.$store.revision.redo();
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
