<template>
  <div data-cy="export_layer" :class="`ml-${layer?.depth * 4}`">
    <CAccordion data-cy="export_layer__accordion_toggle" size="sm" default-open :title="layerName">
      <template #customTitle>
        <div class="flex items-center w-full ml-4 -mt-5 bg-white absolute z-9">
          <CCheckbox
            v-if="
              areAllNestedCalulatedPositionsSelected ||
              (!areAllNestedCalulatedPositionsSelected && !areSomeNestedPositionsCalculated)
            "
            v-model="isSelected"
            size="xs"
            no-wrap
            label-class="text-xs"
            :disabled="isDisabled"
            @change="handleLayerSelection()"
          />

          <button
            v-else
            class="flex justify-center ml-2 items-center w-4 h-4 border text-indigo"
            data-cy="export_layer__partialy_selected_layer"
            @click="handleLayerSelection()"
          >
            <div class="w-2 h-0.5 bg-indigo"></div>
          </button>

          <label class="font-semibold py-1 pl-2" :on-beforeinput="layer?.id">{{ layerName }}</label>
        </div>
      </template>

      <LvExportPositionItem
        v-for="position in layerPositions"
        :key="position.id"
        :position="position"
        :layer="layer"
        class="my-3"
      />
    </CAccordion>
  </div>
</template>

<script setup lang="ts">
  import { computed, inject } from 'vue';
  import STATUSES from '@crhio/concrete/src/components/Status/statuses.js';

  import LvExportPositionItem from './LvExportPositionItem.vue';

  const props = defineProps({
    layer: Object,
  });

  const layersModel = inject('layersModel');
  const positionModel = inject('positionModel');
  const { selectedPositionIds } = inject('selectedPositionIds');

  const { layer } = props;

  const nestedPositionIds = computed(() => {
    const allPositions: Array<string> = [];
    const getNestedIds = (nestedLayer) => {
      allPositions.push(...nestedLayer.orderedPositionIds);

      if (!nestedLayer.orderedLayerIds.length) {
        return;
      }

      nestedLayer.orderedLayerIds.forEach((id) => {
        getNestedIds(layersModel?.find(id));
      });
    };

    getNestedIds(layer);

    return allPositions;
  });

  const isPositionCalculated = (positionId) => {
    return positionModel?.find(positionId).status !== STATUSES.NO_STATUS;
  };

  const isDisabled = computed(() => {
    const isSomePositionCalculated = layer?.orderedPositionIds.some((id) => {
      console.log(positionModel?.find(id).status);

      return isPositionCalculated(id);
    });

    if (layer?.isRoot) {
      const isSomeNestedPositionCalculated = nestedPositionIds.value.some((id) => {
        return isPositionCalculated(id);
      });

      return !isSomeNestedPositionCalculated && !isSomePositionCalculated;
    }

    return !isSomePositionCalculated;
  });

  const layerName = computed(() => props.layer?.custom_name || props.layer?.name);

  const areSomeNestedPositionsCalculated = computed(() => {
    return nestedPositionIds.value.some((positionId) => {
      return selectedPositionIds.value.has(positionId);
    });
  });

  const isSelected = computed(() => {
    if (isDisabled.value) {
      return false;
    }

    return areSomeNestedPositionsCalculated.value;
  });

  const areAllNestedCalulatedPositionsSelected = computed(() => {
    return nestedPositionIds.value.every((positionId) => {
      if (!isPositionCalculated(positionId)) {
        return true;
      }

      return selectedPositionIds.value.has(positionId);
    });
  });

  const layerPositions = computed(() => {
    return layersModel?.find(props.layer?.id).orderedPositionIds.reduce((accumulated, id) => {
      const position = positionModel?.find(id);
      return [...accumulated, position];
    }, []);
  });

  const handleLayerSelection = () => {
    if (areAllNestedCalulatedPositionsSelected.value) {
      nestedPositionIds.value.forEach((positionId) => {
        selectedPositionIds.value.delete(positionId);
      });
    } else {
      nestedPositionIds.value.forEach((positionId) => {
        if (isPositionCalculated(positionId)) {
          selectedPositionIds.value.add(positionId);
        }
      });
    }
  };
</script>
