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
      host.setState(snapshot);
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
