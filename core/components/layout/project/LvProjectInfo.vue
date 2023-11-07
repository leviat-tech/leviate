<template>
  <div class="h-full p-4">

    <div class="text-sky-dark font-bold text-lg mb-2">{{ $L('project_info') }}</div>

    <div class="ml-2">
      <div class="flex justify-between mb-1 text-gray-500 text-base font-bold border-b pb-1 mb-2">
        <div>{{ name }}</div>
        <div>#{{ number }}</div>
      </div>

      <LvAddress :data="project.address"
                 :fields="['name', 'address', 'city', 'postalCode', 'country']"
                 :bold-fields="['name']"/>

    </div>

    <template v-if="customer">

      <div class="text-sky-dark font-bold text-lg mt-6">{{ $L('client_info') }}</div>

      <div class="ml-2">

        <div class="text-gray-500 font-semibold mt-2 border-b pb-1 mb-2">Address</div>

        <div class="font-bold">{{ company }}</div>

        <LvAddress v-if="customer"
                   :data="customer.address"
                   :fields="['street', 'city', 'postcode', 'country']"
                   :bold-fields="['name']"/>

        <div class="text-gray-500 font-semibold mt-4 border-b pb-1 mb-2">Primary Contact</div>

        <address class="not-italic">
          <span class="font-bold">{{ firstName }} {{ lastName }}</span><br>
          <span class="text-sky-dark"><a :href="`mailto:${email}`">{{ email }}</a></span><br>
          <span>{{ phone }}</span>
        </address>
      </div>

    </template>

    <div class="text-right">
      <CButton color="sky" size="sm" @click="openProjectSettings">{{ $L('edit') }}</CButton>
    </div>

  </div>
</template>

<script setup>
import { useHost } from '@crhio/leviate';
import LvAddress from '@crhio/leviate/components/layout/project/LvAddress.vue';

const $host = useHost();
const { project, customer, origin } = $host.meta;

const { name, number } = project;
const { company, firstName, lastName, email, phone } = customer;

function openProjectSettings() {
  const projectEditUrl = `${origin}/projects/${[project.id]}`;
  window.open(projectEditUrl)
}
</script>
