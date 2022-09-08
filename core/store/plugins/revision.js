import omit from 'lodash/omit';
import { createRevision } from '../../extensions/revision';
import { useHost } from '../../plugins/host';

const revision = (store) => {
  store.revision = createRevision(store, 25, {
    autocommit(mutation) {
      const { type, payload } = mutation;
      return store.isInitialized
        && type === 'transaction/SET_TRANSACTION_DEPTH'
        && payload === 0;
    },
    committed(snapshot) {
      const host = useHost();

      if (host.setState) {
        const filtered = omit(snapshot, ['selected', 'search']);
        filtered.settings = omit(filtered.settings, ['configName', 'locale']);
        host.setState(filtered);
      }
    },
  });
};

export default revision;
