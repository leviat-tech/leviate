<template>
  <div class="flex justify-between h-12 p-2 border-b">
    <c-toolbar>
      <c-tool-group>
        <c-tool
          name="Undo"
          tool-id="undo"
          icon="undo"
          :stateful="false"
          @click="revision.undo()"
          :disabled="!undoable"
        />
        <c-tool
          name="Redo"
          tool-id="redo"
          icon="redo"
          :stateful="false"
          @click="revision.redo()"
          :disabled="!redoable"
        />
      </c-tool-group>
    </c-toolbar>
    <c-toolbar>
      <c-tool-group>
        <c-tool name="Export" tool-id="export" icon="download" :stateful="false" @click="showExportModal = true" />
        <c-tool name="Settings" tool-id="settings" :stateful="false" @click="showSettingsModal = true">
          <CogIcon />
        </c-tool>

      </c-tool-group>
    </c-toolbar>

    <lv-export-modal v-model="showExportModal" />
    <lv-settings-modal v-model="showSettingsModal" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRootStore } from '@crhio/leviate/store/index';
import { CogIcon } from '@heroicons/vue/solid';
import LvExportModal from './LvExportModal.vue';
import LvSettingsModal from './LvSettingsModal.vue';

const showExportModal = ref(false);
const showSettingsModal = ref(false);

const revision = useRootStore().revision;
const undoable = computed(() => revision.undoable);
const redoable = computed(() => revision.redoable);
</script>
