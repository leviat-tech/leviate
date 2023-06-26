<template>
  <CModal :show="modelValue" title="Settings" @close="$emit('update:modelValue', false)" size="lg">
    <div class="space-y-4">

      <CTextInput label="config_name" no-translate v-model="data.localConfigName" />
      <CListbox label="locale" :options="Object.keys($host.getDictionary())" v-model="locale"/>
      <CTextArea label="client_notes" v-model="data.localClientNotes" :rows="4"/>
      <CTextArea label="internal_notes" v-model="data.localInternalNotes" :rows="4"/>

      <div class='flex space-x-6 mt-8'>
        <CButton class="w-full" @click="save">Save</CButton>
        <CButton class="w-full" fill="outline" @click="reset">Reset</CButton>
      </div>
    </div>
  </CModal>
</template>


<script setup>
import { computed, reactive } from 'vue';
import { useHost } from '@crhio/leviate';
import { useSettingsStore } from '@/store/settings';

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

const locale = computed({
  get: () => host.locale.value,
  set: (val) => {
    host.locale.value = val
    console.log(host.locale.value, val);
    window.appKey.value = val;
  }
});

const reset = () => {
  Object.assign(data, {
    localConfigName: '',
    localClientNotes: '',
    localInternalNotes: '',
  })
}

const save = () => {
  settings.clientNotes = data.localClientNotes;
  settings.internalNotes = data.localInternalNotes;
  if (settings.configName !== data.localConfigName) {
    this.setName();
  }
  emit('update:modelValue', false);
}

const debug = () => console.log(data);
</script>
