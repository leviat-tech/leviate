import omit from 'lodash/omit';
import { createRevision } from '../../extensions/revision';
import { useHost } from '../../plugins/host';

const revision = (store) => {
  store.revision = createRevision(store, 25, {
    autocommit(mutation, s) {
      return store.isInitialized
        && s.transaction.transactionDepth === 0
        && !mutation.type.startsWith('display')
        && !mutation.type.startsWith('errors')
        && mutation.type !== 'transaction/cleanUpKilledTransaction';
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
