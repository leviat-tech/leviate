<template>
  <CToolbar class="h-12 py-2 border-b bg-gray-50 justify-between" :class="!isExpanded && `flex flex-col-reverse h-auto`">
    <CTool-group :class="!isExpanded && `flex flex-col h-auto mt-1`">
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
      <CTool name="Info"
             tool-id="info"
             icon="information-circle"
             @click="openAppInfoModal"/>
    </CTool-group>
  </CToolbar>
</template>

<script setup>
import { useRootStore } from '@crhio/leviate';
import useAppInfoModal from '@crhio/leviate/composables/useAppInfoModal';
import { useLeviateStore } from '../../../store/leviate.js';
import { computed } from 'vue';

const { openAppInfoModal } = useAppInfoModal();

const revision = useRootStore().revision;
const undoable = revision.undoable;
const redoable = revision.redoable;

const leviate = useLeviateStore();

const isExpanded = computed(() => leviate.panels.project.isExpanded);
</script>
