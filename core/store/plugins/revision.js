import Revision from '../../extensions/Revision';
import { useHost } from '../../plugins/host';
import useVersions from '../../composables/useVersions';
import { markRaw } from 'vue';

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
    const versionId = useVersions().getActiveVersionId();

    if (host.setState) {
      host.setState(snapshot, versionId);
    }
  },
});

const revisionPlugin = ({ store }) => {
  if (store.$id === 'root') {
    store.revision = markRaw(revision);
    revision.initializeStore(store)
  }
};

export default revisionPlugin;
