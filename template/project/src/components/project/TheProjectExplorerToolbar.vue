<template>
  <CToolbar class="flex-1 justify-between">
    <CTool-group>
      <CTool
        name="Undo"
        tool-id="undo"
        icon="undo"
        :stateful="false"
        @click="revision.undo()"
        :disabled="!undoable"
      />
      <CTool
        name="Redo"
        tool-id="redo"
        icon="redo"
        :stateful="false"
        @click="revision.redo()"
        :disabled="!redoable"
      />
    </CTool-group>
    <CTool-group>
      <CTool name="Export"
             tool-id="export"
             icon="download"
             :stateful="false"
             @click="showExportModal = true"/>
      <CTool name="Settings"
             tool-id="settings"
             icon="cog"
             :stateful="false"
             @click="showSettingsModal = true"/>
    </CTool-group>
  </CToolbar>

  <LvExportModal v-model="showExportModal"/>
  <LvSettingsModal v-model="showSettingsModal"/>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRootStore } from '@crhio/leviate/store/index';
import LvExportModal from './LvExportModal.vue';
import LvSettingsModal from './LvSettingsModal.vue';

const showExportModal = ref(false);
const showSettingsModal = ref(false);

const revision = useRootStore().revision;
const undoable = computed(() => revision.undoable);
const redoable = computed(() => revision.redoable);
</script>
