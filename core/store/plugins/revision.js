import { omit } from 'lodash-es';
import Revision from '../../extensions/Revision';
import { useHost } from '../../plugins/host';

const revision = new Revision(25, {
  autocommit(mutation, state) {
    if (mutation.type === 'patch object') {
      revision.outdated = false;
      return false;
    }

    return mutation.storeId === 'root' && state.transactionDepth === 0;
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

const revisionPlugin = ({ store }) => {
  if (store.$id === 'root') {
    store.revision = revision;
    revision.initializeStore(store)
  }
};

export default revisionPlugin;
