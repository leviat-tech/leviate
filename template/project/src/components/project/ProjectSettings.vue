<template>
  <div class="p-4 space-y-4">
    <CFormSection stacked>
      <div class="space-y-4">

        <CTextInput label="config_name" no-translate v-model="data.localConfigName"/>
        <CListbox v-model="data.locale"
                  label="locale"
                  :options="$availableLanguages"
                  :formatter="$L"
        />
        <CTextArea label="client_notes" v-model="data.localClientNotes" :rows="4"/>
        <CTextArea label="internal_notes" v-model="data.localInternalNotes" :rows="4"/>

        <div class='flex space-x-4 mt-8'>
          <CButton class="w-full" @click="save">Save</CButton>
          <CButton class="w-full" fill="outline" @click="reset">Reset</CButton>
        </div>
      </div>
    </CFormSection>
  </div>
</template>


<script setup>
import { reactive } from 'vue';
import { useLocalize } from '@crhio/leviate';
import { useSettingsStore } from '@/store/settings';

const localize = useLocalize();
const settings = useSettingsStore();

const props = defineProps({
  modelValue: Boolean
});

const emit = defineEmits(['update:modelValue']);

const data = reactive({
  localConfigName: settings.configName,
  localClientNotes: settings.clientNotes,
  localInternalNotes: settings.internalNotes,
  locale: localize.locale.value,
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
  settings.locale = localize.locale.value;
  localize.setLocale(data.locale);
  emit('update:modelValue', false);
}

const debug = () => console.log(data);
</script>
