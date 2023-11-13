<template>

  <div class="text-sky-dark font-bold text-lg mt-6">{{ $L('client_info') }}</div>

  <div class="ml-2">

    <div class="text-gray-500 font-semibold mt-2 border-b pb-1 mb-2">Address</div>

    <div class="font-bold">{{ company }}</div>

    <LvAddress :data="address"
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

<script setup>
import LvAddress from './LvAddress.vue';

defineProps({
  address: Object,
  company: String,
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
})
</script>
