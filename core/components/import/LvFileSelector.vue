<template>

	<div 
		@dragenter.prevent="toggleActive"
		@dragleave.prevent="toggleActive"
		@dragover.prevent
		@drop.prevent="drop"
		:class="{ 'bg-indigo text-white' : active }"
		class="border-dashed border-2 text-center justify-center rounded-md w-96 h-52 border-indigo flex flex-col items-center gap-y-2 duration-150"
		>

		<span>Drag files to upload</span>
		<span>OR</span>
		<label for="dxfUpload"
			:class=" { 'bg-white !text-indigo' : active }"
			class="bg-indigo text-white w-2/6 h-8 flex items-center justify-center hover:cursor-pointer px-12 py-8 whitespace-nowrap">Select File</label>
		<input type="file" id="dxfUpload" ref="file" class="hidden">
		<pre>File: {{ fileName }}</pre>
	
	</div>
	<!--<pre id="output" style="font-family: monospace;">{{ dxfJSON }}</pre>-->

</template>

<script setup>
import { ref, computed, watch, onMounted, defineEmits } from "vue";
import { useDxfImporter } from '@crhio/leviate/composables/useDxfImporter';

const dxfJSON = ref({});

const layerSortedJSON = ref();

const file = ref("");

const fileName = ref("");

const active = ref(false);

const emit = defineEmits();

const toggleActive = () => {
	active.value = !active.value;
};

// Handles file data when dropped into zone.
const drop = async (e) => {
	// e refers to event data obtained from drop event
	dxfJSON.value = await useDxfImporter(e.dataTransfer.files[0]);
	fileName.value = e.dataTransfer.files[0].name
	// ------------------------------------------------------------------> Input param is of the wrong format.
	sortJSON(dxfJSON);
};

// Watches for manual file upload.
onMounted(() => {
	file.value.onchange = async function() {
		// This refers to file element upon change
		dxfJSON.value = await useDxfImporter(this.files[0]);
		fileName.value = this.files[0].name;

		// ------------------------------------------------------------------> Input param is of the wrong format.
		sortJSON(dxfJSON);
	};
});



const sortJSON = (dxfJSON) => {

	const entities = dxfJSON.value.entities;

	layerSortedJSON.value = Object.values(
  // Accumulates into result
  entities.reduce((result, obj) => {
    // Push object into current layer array (if one exists), or create a new one to push to
    (result[obj.layer] || (result[obj.layer] = [])).push(obj);

    return result;
		}, {})
	);

	// layerSortedJSON.value = JSON.stringify(layerSortedJSON, null, 2);
	emit("layersSorted", layerSortedJSON.value);
}

</script>