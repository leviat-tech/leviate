import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useRootStore } from '@crhio/leviate/store/index';

const useCurrentEntity = () => {
  const route = useRoute();
  const store = useRootStore();

  return computed(() => {
    if (!route.params) return null;

    const { entity, id } = route.params;

    if (!entity || !id) return null;


    const entitiesStore = store.modules.entities();

    return entitiesStore.models[entity].find(id);
  })
}

export default useCurrentEntity;
