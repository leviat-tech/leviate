<template>
  <CModal :title="manifest.name" :show="isAppInfoModalOpen" @close="closeAppInfoModal">
    <div class="flex -m-6 p-6 bg-base-100">
      <div class="flex-grow flex flex-col justify-between mr-24 text-xs leading-5">
        <div>
          <LvLogo width="200" class="mb-1" />
          <div>{{ $l('built_by') }} Leviat Digital Engineering</div>
        </div>

        <div>
          <div>{{ $L('version') }} {{ manifest.version }}</div>
          <div> {{ $l('built_on') }} {{ manifest.date }}
          </div>
          <RouterLink to="/release-notes" class="text-status-info" @click="closeAppInfoModal">
            ({{ $l('release_notes') }})
          </RouterLink>
        </div>

        <div>&copy; {{ new Date().getFullYear() }} Leviat. {{ $l('all_rights_reserved') }}</div>



      </div>
      <div>
        <img src="/thumbnail.png" width="220" height="220" class="border rounded bg-white"/>
      </div>
    </div>
  </CModal>
</template>

<script setup>
import useAppInfo from '../composables/useAppInfo.js';
import LvLogo from '@crhio/leviate/components/ui/LvLogo.vue';

const { isAppInfoModalOpen, closeAppInfoModal, manifest } = useAppInfo();

</script>
