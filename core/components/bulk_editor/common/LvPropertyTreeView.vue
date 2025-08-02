<template>
  <div data-cy="export_property" :class="`ml-${propObj.depth * 4}`">
    <CAccordion data-cy="export_property__accordion_toggle" size="sm" default-open :title="objName">
      <template #customTitle>
        <div class="flex items-center w-full ml-4 -mt-5 bg-white absolute z-9">
          <CCheckbox
            :model-value="isSelected"
            size="xs"
            no-wrap
            label-class="text-xs"
            @change="handleLayerSelection"
          />

          <button
            class="font-semibold py-1 pl-2 select-none cursor-pointer"
            @click="handleLayerSelection"
          >
            {{ objName }}
          </button>
        </div>
      </template>
      <LvPropertyItem v-for="property in nestedPropObjs" :key="property" :prop-name="`${property}`" />
    </CAccordion>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import LvPropertyItem from './LvPropertyItem.vue';
import useSelectedProperties from '../composables/useSelectedProperties.ts';

const selectedProps = useSelectedProperties();

const props = defineProps({
  propObj: {
    type: Object,
    required: true,
  },
});

const { propObj } = props;

const nestedPropObjs = computed(() => {
  const allObjs = [];
  const getNestedObjs = nestedObj => {
    Object.keys(nestedObj).forEach(o => {
      if (!(nestedObj[o] instanceof Object)) {
        const propName = propObj.depth === 0 ? `${o}` : `${propObj.name}.${o}`;
        allObjs.push(propName);
      }
    });
  };

  getNestedObjs(propObj.obj);

  return allObjs;
});

const areSomeNestedPropertiesSelected = computed(() => {
  return nestedPropObjs.value.some(prop => {
    return selectedProps.value.includes(prop);
  });
});

const objName = computed(() => props.propObj?.name);
const isSelected = computed(() => {
  return areSomeNestedPropertiesSelected.value;
});

const areAllNestedPropertiesSelected = computed(() => {
  return nestedPropObjs.value.every(prop => {
    return selectedProps.value.includes(prop);
  });
});

const handleLayerSelection = () => {
  if (areAllNestedPropertiesSelected.value) {
    nestedPropObjs.value.forEach(prop => {
      selectedProps.value = selectedProps.value.filter(p => p !== prop);
    });
  } else {
    nestedPropObjs.value.forEach(prop => {
      selectedProps.value.push(prop);
    });
  }
};
</script>
