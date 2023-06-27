<template>
  <CModal :show="modelValue" title="Settings" @close="$emit('update:modelValue', false)" size="lg">
    <div class="space-y-4">

      <CTextInput label="config_name" no-translate v-model="data.localConfigName" />
      <CListbox label="locale" :options="Object.keys($host.getDictionary())" v-model="data.locale"/>
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
  localConfigName: settings.configName,
  localClientNotes: settings.clientNotes,
  localInternalNotes: settings.internalNotes,
  locale: host.locale.value,
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
  settings.configName = data.localConfigName;
  settings.locale = host.locale.value;
  host.locale.value = data.locale;
  emit('update:modelValue', false);
}

const debug = () => console.log(data);
</script>
