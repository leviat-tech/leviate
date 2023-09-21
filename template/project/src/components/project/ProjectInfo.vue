<template>
  <div class="p-4">
    <CFormSection :title="$L('project_info')" stacked>
      <div class="space-y-2">
        <CTextInput label="project_name" v-model="name" disabled/>
        <CTextInput label="project_location" v-model="projectAddress.street" disabled/>
        <CTextInput label="project_number" v-model="number" disabled/>
        <CTextInput label="project_designer" v-model="designer" disabled/>
      </div>
    </CFormSection>

    <CFormSection :title="$L('client_info')" stacked>
      <div class="space-y-2">
        <CTextInput label="client_company" v-model="company" disabled/>
        <CTextInput label="client_street" v-model="clientAddress.street" disabled/>
        <CTextInput label="client_postcode" v-model="clientAddress.postcode" disabled/>
        <CTextInput label="client_city" v-model="clientAddress.city" disabled/>
        <CTextInput label="client_country" v-model="clientAddress.country" disabled/>
        <CTextInput label="client_primary_contact" :value="primaryContact" disabled/>
        <CTextInput label="client_email" v-model="email" disabled/>
        <CTextInput label="client_phone_number" v-model="phone" disabled/>
      </div>
    </CFormSection>
  </div>
</template>

<script setup>
import { useHost } from '@crhio/leviate';
import { computed } from 'vue';

const props = defineProps({
  modelValue: Boolean
});

const emit = defineEmits(['update:modelValue']);

const $host = useHost();
const project = $host.getMeta().project;
const client_host = $host.getMeta().customer;
const client_blank = {
  company: 'No Company Info',
  phone: '',
  firstName: '',
  lastName: '',
  email: '',
  address: {
    street: '',
    postcode: '',
    city: '',
    country: '',
  },
};
const client = !client_host ? client_blank : client_host;

const { name, address: projectAddress, number, designer } = project;
const { company, address: clientAddress, firstName, lastName, email, phone } = client;
const primaryContact = computed(() => {
  return `${firstName} ${lastName}`;
});
</script>
