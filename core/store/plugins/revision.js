import omit from 'lodash/omit';
import Revision from '../../extensions/revision';
import { useHost } from '../../plugins/host';

const revision = ({ store }) => {
  store.revision = new Revision(store, 25, {
    autocommit(mutation, s) {
      return s.transaction.transactionDepth === 0
        && !mutation.type.startsWith('display')
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
