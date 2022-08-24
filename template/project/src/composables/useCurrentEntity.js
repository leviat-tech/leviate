import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useRootStore } from '@crhio/leviate/store/index';

const useCurrentEntity = () => {
  const route = useRoute();
  const store = useRootStore();

  return computed(() => {
    if (!route.params) return null;

    return store.currentEntity;
  });
};

export default useCurrentEntity;
