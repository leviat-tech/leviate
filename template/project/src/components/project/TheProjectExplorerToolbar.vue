<template>
  <CToolbar class="flex-1 justify-between">
    <CTool-group>
      <CTool
        name="Undo"
        tool-id="undo"
        icon="undo"
        @click="revision.undo()"
        :disabled="!undoable"
      />
      <CTool
        name="Redo"
        tool-id="redo"
        icon="redo"
        @click="revision.redo()"
        :disabled="!redoable"
      />
    </CTool-group>
    <CTool-group>
      <CTool name="Export"
             tool-id="export"
             icon="download"
             @click="showExportModal = true"/>
      <CTool name="Settings"
             tool-id="settings"
             icon="cog"
             @click="showSettingsModal = true"/>
      <CTool name="Info"
             tool-id="info"
             icon="information-circle"
             @click="openAppInfoModal"/>
    </CTool-group>
  </CToolbar>

  <LvExportModal v-model="showExportModal"/>
  <LvSettingsModal v-model="showSettingsModal"/>
  <LvAppInfoModal />
</template>

<script setup>
import { ref } from 'vue';
import { useRootStore } from '@crhio/leviate';
import LvExportModal from './LvExportModal.vue';
import LvSettingsModal from './LvSettingsModal.vue';
import LvAppInfoModal from '@crhio/leviate/components/LvAppInfoModal.vue'
import useAppInfoModal from '@crhio/leviate/composables/useAppInfoModal';

const showExportModal = ref(false);
const showSettingsModal = ref(false);
const { openAppInfoModal } = useAppInfoModal();

const revision = useRootStore().revision;
const undoable = revision.undoable;
const redoable = revision.redoable;
</script>
