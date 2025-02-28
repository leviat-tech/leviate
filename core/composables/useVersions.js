import { computed, ref } from 'vue';
import { useHost } from '../plugins/host';
import { useRootStore } from '@crhio/leviate';

let isInitialized = ref(false);

const versions = ref([]);
export const activeVersionId = ref(null);

const activeVersion = computed(() => {
  return (
    versions.value.find((version) => version.id === activeVersionId.value) ||
    useHost().configuration
  );
});

const rootVersionId = computed(() => {
  const rootVersion = versions.value.find((version) => !version.parentId);
  return rootVersion.id;
});

function getVersionById(id) {
  return versions.value.find((version) => version.id === id);
}

function loadVersion(id) {
  const newState = getVersionById(id).state;
  useRootStore().replaceState(newState);
  activeVersionId.value = id;
  window.location.reload();
}

async function fetchVersions() {
  versions.value = await useHost().getVersions();
}

export default function useVersions() {
  if (!isInitialized.value) {
    fetchVersions().then(() => {
      isInitialized.value = true;
    });
  }

  return {
    versions,
    isInitialized,
    activeVersion,
    activeVersionId,
    rootVersionId,
    getVersionById,
    loadVersion,
    setName: async (name, id) => {
      await useHost().setName(name, id);
      fetchVersions();
    },
    createVersion: async (name, fromId) => {
      const id = fromId || activeVersionId.value;
      const newVersion = await useHost().createVersion(name, id);
      await fetchVersions();
      loadVersion(newVersion.id);
    },
    deleteVersion: async (id) => {
      const nextActiveVersionIndex = versions.value.findIndex((version) => version.id === id) - 1;
      const nextActiveVersionId = versions.value[nextActiveVersionIndex].id;
      await useHost().deleteVersion(id);
      loadVersion(nextActiveVersionId);
      fetchVersions();
    },
  };
}
