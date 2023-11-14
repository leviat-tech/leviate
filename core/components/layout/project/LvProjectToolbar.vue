<template>
  <div class="bg-gray-50 h-12 border-b" :class="isExpanded && 'py-2'">
    <CToolbar class="justify-between"
              :class="!isExpanded && `flex flex-col-reverse h-auto`">
      <CTool-group :class="!isExpanded && `flex mt-1 -space-x-1`">
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
      <CTool-group v-if="isExpanded">
        <CTool name="Info"
               tool-id="info"
               icon="information-circle"
               @click="openAppInfoModal"/>
      </CTool-group>
    </CToolbar>
  </div>
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
