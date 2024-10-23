import Revision from '../../extensions/Revision';
import { markRaw } from 'vue';


const revisionPlugin = ({ store }) => {
  if (store.$id === 'root') {
    const revision = new Revision(store, 25);
    store.revision = markRaw(revision);
  }
};

export default revisionPlugin;
