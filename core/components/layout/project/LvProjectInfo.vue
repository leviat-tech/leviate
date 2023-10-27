<template>
  <div class="h-full p-4">

    <div class="text-sky-dark font-bold text-lg mb-2">{{ $L('project_info') }}</div>

    <div class="ml-2">
      <div class="flex justify-between mb-1 font-bold">
        <div>{{ name }}</div>
        <div>#{{ number }}</div>
      </div>

      <address class="not-italic">
        <template v-for="field in projectAddressFields">
          {{ project.address[field] }}<br>
        </template>
      </address>

    </div>

    <div class="text-sky-dark font-bold text-lg mt-6">{{ $L('client_info') }}</div>

    <div class="ml-2">

      <div class="text-gray-500 font-semibold mt-2 border-b pb-1 mb-2">Address</div>

      <div class="font-bold">{{ company }}</div>

      <address class="not-italic">
        <template v-for="field in customerAddressFields">
          {{ client.address[field] }}<br>
        </template>
      </address>

      <div class="text-gray-500 font-semibold mt-4 border-b pb-1 mb-2">Primary Contact</div>
      <div class="">{{ primaryContact }}</div>
      <div><a :href="`mailto:$email`">{{ email }}</a></div>
      <div>{{ phone }}</div>
    </div>

  </div>
</template>

<script setup>
import { useHost } from '@crhio/leviate';
import { computed } from 'vue';

const $host = useHost();
const { project, customer } = $host.getMeta();
const customerBlank = {
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
const client = customer || customerBlank;

const { name, address: projectAddress, number, designer } = project;
const { company, address: clientAddress, firstName, lastName, email, phone } = client;
const primaryContact = computed(() => {
  return `${firstName} ${lastName}`;
});

const projectAddressFields = ['name', 'address', 'city', 'postalCode', 'country'];
const customerAddressFields = ['street', 'city', 'postcode', 'country'];
</script>
