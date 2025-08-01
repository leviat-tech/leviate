<template>
  <div class="p-6 flex flex-col h-full max-w-7xl mx-auto">
    <header class="mb-6">
      <h1 class="text-xl font-medium text-gray-900">Bulk Edit</h1>
      <p class="text-sm text-gray-500">Edit multiple position values simultaneously</p>
    </header>

    <div
      class="border rounded-lg shadow-sm bg-white overflow-auto"
      style="max-width: 68vw; max-height: calc(100vh - 240px)"
    >
      <CTable
        :rows="entities"
        :columns="columns"
        :table-class="tableClasses.table"
        :cell-class="tableClasses.cell"
        :header-class="tableClasses.header"
      >
        <template v-for="col in columns" :key="col.id" #[col.id]="{ row }">
          <div class="relative">
            <component
              :is="componentTypeMap[col.type]"
              :id="`${row.id}:${col.id}`"
              :model-value="pendingChanges[`${row.id}:${col.id}`] ?? row.data[col.id]"
              class="w-full text-right pr-2"
              no-wrap
              no-spinner
              no-units
            />
          </div>
        </template>
      </CTable>
    </div>

    <div class="mt-4 flex justify-end gap-3">
      <button
        class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        @click="resetChanges"
        :disabled="!hasChanges"
      >
        Reset
      </button>
      <button
        class="px-4 py-2 text-sm font-medium text-white bg-indigo rounded-md hover:bg-indigo-700 disabled:opacity-50"
        @click="applyChanges"
        :disabled="!hasChanges"
      >
        Apply
      </button>
    </div>
    {{ pendingChanges }}
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, provide } from 'vue';
import { get, set } from 'lodash-es';
import { transact } from '@crhio/leviate';
import { CTextInput, CNumericInput, CListbox } from '@crhio/concrete';
import { getFlatObject } from './utils';
import { has } from 'lodash';

const props = defineProps<{
  entities: Array<Position>;
  model: unknown;
  config: Record<string, unknown>;
}>();

const emit = defineEmits(['update:entities']);

type Position = {
  id: string;
  name: string;
  data: Record<string, any>;
};

const tableClasses = {
  table: 'w-full text-sm divide-y divide-gray-200',
  cell: 'px-3 py-2 whitespace-nowrap',
  header:
    'px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider bg-indigo sticky top-0 z-10 min-w-[8rem] flex-shrink-0',
};

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
      const position = props.entities.find(p => p.id === rowId);
      if (!position) return;

      position.data[fieldPath] = value;
    });

    pendingChanges.value = {};
    emit('update:entities', props.entities);
  });
}

function resetChanges() {
  pendingChanges.value = {};
}
</script>
