<template>
  <div class="h-full flex flex-col bg-gray-50">
    <header class="px-8 py-3">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-xl font-medium text-gray-900">Bulk Edit</h1>
      </div>
    </header>

    <div class="px-8 flex flex-col">
      <div class="max-w-7xl mx-auto w-full">
        <div
          class="overflow-hidden"
          style="height: calc(100vh - 14rem)"
        >
          <div class="overflow-auto h-full">
            <table class="border border-gray-200 shadow-sm text-sm">
              <thead>
              <tr>
                <th
                  v-for="col in columns"
                  :key="col.id"
                  class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider bg-indigo sticky top-0 z-10"
                >
                  {{ col.id }}
                </th>
              </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
              <tr
                v-for="row in entities"
                :key="row.id"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td v-for="col in columns" :key="col.id" class="whitespace-nowrap">
                  <component
                    :is="componentTypeMap[col.type]"
                    :id="`${row.id}:${col.id}`"
                    class="text-right pr-2 focus:ring-2"
                    no-wrap
                    no-spinner
                    no-units
                  />
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="h-16 flex items-center justify-between">
          <div class="text-sm text-gray-500">
            <span v-if="hasChanges" class="flex items-center">
              <span class="w-2 h-2 bg-indigo rounded-full mr-2" />
              Unsaved changes
            </span>
          </div>
          <div class="flex gap-4">
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-indigo disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!hasChanges"
              @click="resetChanges"
            >
              Reset Changes
            </button>
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo rounded-md hover:bg-indigo/90 focus:ring-2 focus:ring-indigo disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!hasChanges"
              @click="applyChanges"
            >
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, provide } from 'vue';
import { has, get, set } from 'lodash-es';
import { transact } from '@crhio/leviate';
import { CTextInput, CNumericInput, CListbox } from '@crhio/concrete';
import { getFlatObject } from './utils';
import BaseModel from '../../BaseModel';

const props = defineProps<{
  entities: Entity[];
  model: typeof BaseModel;
  config: Record<string, unknown>;
}>();

const emit = defineEmits(['update:entities']);

interface Entity extends BaseModel {}

const componentTypeMap = {
  text: CTextInput,
  number: CNumericInput,
  select: CListbox,
};

const flatConfig = getFlatObject(props.config);
const columns = Object.entries(flatConfig).map(([key, value]) => ({
  id: key,
  type: value,
}));

const pendingChanges = ref<Record<string, any>>({});
const hasChanges = computed(() => Object.keys(pendingChanges.value).length > 0);

const concrete = inject('concrete');

provide('concrete', {
  ...concrete,
  inputHandler: (id, value) => {
    pendingChanges.value[id] = value;
  },
  inputIdToValue: id => {
    return has(pendingChanges.value, id)
      ? get(pendingChanges.value, id)
      : concrete.inputIdToValue(id);
  },
});

function applyChanges() {
  transact('Bulk update', () => {
    Object.entries(pendingChanges.value).forEach(([key, value]) => {
      const [rowId, fieldPath] = key.split(':');
      const entity = props.entities.find(p => p.id === rowId);
      if (!entity) return;

      set(entity, fieldPath, value);
    });

    pendingChanges.value = {};
    emit('update:entities', props.entities);
  });
}

function resetChanges() {
  pendingChanges.value = {};
}
</script>
