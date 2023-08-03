<template>
  <CModal :title="manifest.name" :show="isAppInfoModalOpen" @close="closeAppInfoModal">
    <div class="flex -m-6 p-6 bg-gray-100">
      <div class="flex-grow flex flex-col justify-between mr-24 text-xs leading-5">
        <div>
          <img src="https://leviatcdn.blob.core.windows.net/static/branding/logo.png" width="180" class="mb-1"/>
          <div>{{ $l('built_by') }} Leviat Digital Engineering</div>
        </div>

        <div>
          <div>{{ $L('version') }} {{ manifest.version }}</div>
          <div> {{ $l('built_on') }} {{ getDateString() }}
          </div>
          <RouterLink to="/release-notes" class="text-indigo" @click="closeAppInfoModal">
            ({{ $l('release_notes') }})
          </RouterLink>
        </div>

        <div>&copy; {{ new Date().getFullYear() }} Leviat. {{ $l('all_rights_reserved') }}</div>



      </div>
      <div>
        <img src="/thumbnail.png" width="200" class="p-4 border rounded bg-white"/>
      </div>
    </div>
  </CModal>
</template>

<script setup>
import { ref } from 'vue';
import useAppInfoModal from '../composables/useAppInfoModal.js';

const manifest = ref({});
const { isAppInfoModalOpen, closeAppInfoModal } = useAppInfoModal();

function getDateString() {
  return new Date(manifest.value.date).toLocaleDateString().replace(/\//g, '-');
}

fetch('/manifest.json')
.then(res => res.json())
.then(manifestJson => manifest.value = manifestJson);

</script>