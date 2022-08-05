import { omit } from 'lodash-es';
import Revision from '../../extensions/revision';
import { useHost } from '../../plugins/host';

const revision = new Revision(25, {
  autocommit(mutation, state) {
    return state.transactionDepth === 0
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
  } else if (store.$id !== 'display1') {
    revision.addStore(store);
  }
};

export default revisionPlugin;
