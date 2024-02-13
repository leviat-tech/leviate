import { ref } from 'vue';

const isAppInfoModalOpen = ref(false);
const manifest = ref({});

async function fetchManifest() {
  const manifestData = await fetch('manifest.json').then(res => res.json())
  manifestData.date = new Date(manifestData.date).toLocaleDateString().replace(/\//g, '-');
  manifest.value = manifestData;
}

export default function useAppInfo() {
  if (!manifest.value.name) fetchManifest();

  return {
    manifest,
    isAppInfoModalOpen,
    openAppInfoModal: () => isAppInfoModalOpen.value = true,
    closeAppInfoModal: () => isAppInfoModalOpen.value = false,
  }
}
