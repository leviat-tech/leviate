import { computed, reactive } from 'vue';
import { each, isEmpty, map, omitBy, set, unset } from 'lodash-es';
import useVersions from '../composables/useVersions';
import { useHost } from '../plugins/host';


class Revision {
  constructor(store, maxUpdates = 25) {
    this.store = store;
    this.maxUpdates = maxUpdates;
    this.undos = reactive([]);
    this.redos = reactive([]);

    this.redoable = computed(() => this.redos.length > 0);
    this.undoable = computed(() => this.undos.length > 0);
  }

  // save current state to undo stack
  commit(patch) {
    const dontUndo = (val,key) => key.startsWith("settings.")
    const cleanPatch = patch.map((change) => {
      return { newValue: omitBy(change.newValue, dontUndo), oldValue: omitBy(change.oldValue, dontUndo) }
    }).filter((change) => !isEmpty(change.newValue) || !isEmpty(change.oldValue) )
    if (cleanPatch.length === 0) return
    this.undos.push(cleanPatch);

    // Redo is no longer possible once a new change has been made
    this.redos.length = 0;

    if (this.undos.length > this.maxUpdates) {
      this.undos.shift();
    }
  }

  undo() {
    if (!this.undoable) return;
    const undoItem = this.undos.pop();
    this.redos.push(undoItem);

    const updates = map(undoItem, 'oldValue');

    this.applyUpdates(updates);
  }

  redo() {
    if (!this.redoable) return;
    const redoItem = this.redos.pop();
    this.undos.push(redoItem);

    const updates = map(redoItem, 'newValue').reverse();

    this.applyUpdates(updates);
  }

  applyUpdates(updates) {
    console.log("apply updates ch test version 1")
    const { transactionDepth, ...state } = this.store.toJSON();
    const { activeVersion, activeVersionId } = useVersions();

    const _useStateCompression = false //TODO make this an export from the store
    updates.forEach(async patch => {
      each(patch, (val, key) =>  {
        if (val === undefined) {
          unset(state, key);
        } else {
          set(state, key, val);
        }
      });
      
      const stateToSave = _useStateCompression ? await compressState(patch) : patch;

      console.log(stateToSave)

      const { activeVersionId } = useVersions();
      useHost().setState(stateToSave, activeVersionId.value);
    });

    this.store.replaceState(state);
    
    
    
  }

  // clear revision undo / redo stack
  clear() {
    this.undos.length = 0;
    this.redos.length = 0;
  }
}

export default Revision;
