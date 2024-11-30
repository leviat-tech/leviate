<template>
  <div>
    <h1>Hierarchy Tree</h1>
    <h2>Type of data: {{ typeof(normalisedEntities) }}</h2>
    <div v-for="(entity, entityIndex) in normalisedEntities" :key="entityIndex" class="checkbox-item">
      <input type="checkbox" :value="entityIndex">
      <label>{{  `Shape ${entityIndex}: ${entity.type}` }}</label>
    </div>
  </div>

  <div class="flex">
    <pre>{{  layerSortedJSON }}</pre>
    <pre>{{ normalisedEntities }}</pre>
  </div>
</template>

<script setup>
import { forEach, cloneDeep, pick } from "lodash-es";
import { defineProps, ref, onMounted, watch } from "vue";


const props = defineProps({
  layerSortedJSON: {
    type: Array,
    required: true,
    default: () => []
  }
});

const normalisedEntities = ref([]);
let mutatableJSON = cloneDeep(props.layerSortedJSON);


/**
 * Parses an array of vertices and returns lowest coordinates for normalisation.
 * @param { object } upload - The array of vertices to be parsed.
 * @return { object } - Containing min values for x and y.
 */
const findMinCoords = (vertices) => {

  // Intialise as highest number
  let minX = Infinity;
  let minY = Infinity;

  vertices.forEach((vertex) => {
    // Update minimum x coordinate with lowest value
    if (vertex.x < minX) {
      minX = vertex.x;
    }
    // Update minimum y coordinate with lowest value
    if (vertex.y < minY) {
      minY = vertex.y;
    }
  })
  return {"x": minX, "y": minY};
}

const normalise = (layer) => {
  // Iterates through each entity for each array of vertices.
  layer.forEach((entity) => {
    if (entity.type === "LWPOLYLINE" || entity.type === "POLYLINE") {
      const minCoords = findMinCoords(entity.vertices);
      let pickedProperties = [];
      entity.vertices.forEach((vertex) => {
      vertex.x = vertex.x - minCoords.x;
      vertex.y = vertex.y - minCoords.y;
      pickedProperties.push(pick(vertex, ['x', 'y', 'bulge']));
      })
      normalisedEntities.value.push({type: entity.type, vertices: pickedProperties, layer: entity.layer});
    }
  })
}

const processJSON = (JSON) => {
  JSON.forEach((layer) => {
    normalise(layer);
  })
}

// getter function to grab prop
watch(() => props.layerSortedJSON, (newLayerSortedJSON) => {
  // Flush normalised entities
  normalisedEntities.value = [];
  mutatableJSON = cloneDeep(props.layerSortedJSON);
  processJSON(mutatableJSON);
  },
  // run by default
  { immediate: true }
)

</script>