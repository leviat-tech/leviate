<style scoped lang="scss">
</style>


<template>
  <c-modal v-model="showModal" title="Settings" @close="close" size="lg">
    <div class="space-y-4">

      <div class="flex justify-between space-x-8">
        <div class="py-1">Config Name</div>
        <div class="w-64">
<!--          <c-text-input v-model="localConfigName" />-->
        </div>
      </div>

      <div class="flex justify-between space-x-8">
        <div class="py-1">Language</div>
        <div class="w-64">
<!--          <c-text-input :disabled="true" :value="locale" />-->
        </div>
      </div>

      <div class="flex justify-between space-x-8">
        <div class="py-1">Client Notes</div>
        <div class="w-64">
<!--          <c-textarea v-model="localClientNotes" :rows="4" />-->
        </div>
      </div>

      <div class="flex justify-between space-x-8">
        <div class="py-1">Internal Notes</div>
        <div class="w-64">
<!--          <c-textarea v-model="localInternalNotes" :rows="4" />-->
        </div>
      </div>

      <div class='flex space-x-8 mt-8'>
        <button class="btn secondary w-full" @click="reset">
          Reset
        </button>
        <button class="btn secondary w-full" @click="save">
          Save
        </button>
      </div>

      <div class='flex'>
        <c-button color="success" @click="debug">
          Debug
        </c-button>
      </div>
    </div>
  </c-modal>
</template>


<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { useHost } from '@crhio/leviate/plugins/host';
import { useSettingsStore } from '@crhio/leviate/store/settings';

const host = useHost();
const settings = useSettingsStore();

const props = defineProps({
  modelValue: Boolean
});

const emit = defineEmits(['update:modelValue']);

const data = reactive({
  localConfigName: '',
  localClientNotes: '',
  localInternalNotes: '',
});

const showModal = ref(props.modelValue);
const showValue = computed(() => props.modelValue);

const save = () => {
  settings.clientNotes = data.localClientNotes;
  settings.internalNotes = data.localInternalNotes;
  if (settings.configName !== data.localConfigName) {
    this.setName();
  }
  showModal.value = false;
}

const debug = () => console.log(data);

const setName = async () => {
  host.setName(data.localConfigName);
  settings.configName = data.localConfigName;
}

watch(showModal, (show) => {
  emit('update:modelValue', show);
});

watch(showValue, val => {
  showModal.value = val;
})
</script>
