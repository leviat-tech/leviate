<template>
  <div class="h-full flex">
    <div class="basis-1/4 min-w-[300px] px-4 border-r h-full overflow-scroll">
      <LvExportItemsSelection :warningMessage="warningMessage">
        <LvExportLayer v-for="layer in orderedLayers" :key="layer.id" :layer="layer" class="mb-2" />
      </LvExportItemsSelection>
    </div>
    <div class="my-6 px-4 w-full">
      <CFormSection title="Document" size="md">
        <CFormElement label="report_type">
          <CSelectFileType
            v-model:currentFileType="selectedDocType"
            class="w-[150px]"
            :types="types"
          />
        </CFormElement>
      </CFormSection>

      <div class="w-full border-t border-steel border-dotted mt-4 pt-4">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, provide, ref, watch } from 'vue';
  import { useLocalize } from '@crhio/leviate';

  import LvExportLayer from './LvExportLayer.vue';
  import LvExportItemsSelection from './LvExportItemsSelection.vue';
  import AVAILABLE_EXPORT_TYPES from './availableExportTypes';

  const props = defineProps({
    positionModel: Function,
    layersModel: Function,
    availableDocTypes: {
      type: Array<{ type: string; configuration?: { size: string; ext: string; label: string } }>,
      required: true,
    },
  });

  const defaultTypesConfiguration = {
    [AVAILABLE_EXPORT_TYPES.OVERVIEW]: {
      size: 'A4',
      ext: 'pdf',
      label: 'Pdf',
    },
    [AVAILABLE_EXPORT_TYPES.PART_LIST]: {
      size: 'A4',
      ext: 'xls',
      label: 'Xls',
    },
  };

  const types = computed(() => {
    return props.availableDocTypes.reduce((acc, curr) => {
      acc[curr.type] = curr.configuration || defaultTypesConfiguration[curr.type];
      return acc;
    }, {});
  });

  function sortRecursively(initialItems, subItemsKey, formatItem) {
    const itemsReducer = (items, item) => {
      const formattedItem = formatItem(item);

      return [...items, formattedItem, ...formattedItem[subItemsKey].reduce(itemsReducer, [])];
    };

    return initialItems.reduce(itemsReducer, []);
  }

  const emit = defineEmits(['updateSelection', 'updateExportDocType']);
  const selectedDocType = ref(props.availableDocTypes[0].type);
  const selectedPositionIds = ref(new Set());

  const { $l } = useLocalize();

  provide('positionModel', props.positionModel);
  provide('layersModel', props.layersModel);
  provide('selectedPositionIds', {
    selectedPositionIds,
    addId: (id: string) => {
      selectedPositionIds.value.add(id);
    },
    removeId: (id: string) => {
      selectedPositionIds.value.delete(id);
    },
  });

  const warningMessage = computed(() => {
    if (props.positionModel?.read().some((position) => !position.results?.is_calculated)) {
      return $l('uncalculated_position_detected');
    }
    return null;
  });

  const orderedLayers = computed(() => {
    const rootLayer = props.layersModel?.read().find((layer) => layer.isRoot);

    return sortRecursively([rootLayer.id], 'orderedLayerIds', (id: string) =>
      props.layersModel?.find(id)
    );
  });

  watch(
    selectedPositionIds,
    () => {
      emit('updateSelection', selectedPositionIds.value);
    },
    { deep: true }
  );

  watch(selectedDocType, () => {
    emit('updateExportDocType', selectedDocType.value);
  });
</script>
