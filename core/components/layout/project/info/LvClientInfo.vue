<template>
  <CHeading :size="2" :title="$L('client_info')" class="mt-4" />

  <div class="">

    <div class="text-base-800 font-semibold border-b pb-1 mb-2 text-sm">Address</div>

    <div class="font-semibold">{{ company }}</div>

    <LvAddress :data="address"
               :fields="['street', 'city', 'postcode', 'country']"
               :bold-fields="['name']"/>

    <div class="text-base-800 font-semibold mt-4 border-b pb-1 mb-2text-sm">Primary Contact</div>

    <address class="not-italic">
      <span class="font-semibold">{{ firstName }} {{ lastName }}</span><br>
      <span class="text-status-info font-medium"><a :href="`mailto:${email}`">{{ email }}</a></span><br>
      <span>{{ phone }}</span>
    </address>
  </div>

</template>

<script setup>
import LvAddress from './LvAddress.vue';
// import { CHeading } from '@crhio/concrete';

defineProps({
  address: Object,
  company: String,
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
})
</script>
