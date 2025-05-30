import { computed, reactive } from 'vue';
import { each, isEmpty, map, omitBy, set, unset } from 'lodash-es';


class Revision {
  constructor(store, maxUpdates = 25) {
    this.store = store;
    this.maxUpdates = maxUpdates;
    this.undos = reactive([]);
    this.redos = reactive([]);
    this.transactionId = null;

    this.redoable = computed(() => this.redos.length > 0);
    this.undoable = computed(() => this.undos.length > 0);
  }

  // save current state to undo stack
  commit(patch, transactionId) {
    const dontUndo = (val,key) => key.startsWith('settings.')
    const cleanPatch = patch.map((change) => {
      return { newValue: omitBy(change.newValue, dontUndo), oldValue: omitBy(change.oldValue, dontUndo) }
    }).filter((change) => !isEmpty(change.newValue) || !isEmpty(change.oldValue) )
    if (cleanPatch.length === 0) return
    this.undos.push(cleanPatch);

    this.transactionId = transactionId;

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
    const { transactionDepth, ...state } = this.store.toJSON();

    updates.forEach(patch => {
      each(patch, (val, key) => {
        if (val === undefined) {
          unset(state, key);
        } else {
          set(state, key, val);
        }
      });
    });

    this.store.replaceState(state, true);
  }

  // clear revision undo / redo stack
  clear() {
    this.undos.length = 0;
    this.redos.length = 0;
  }
}

export default Revision;
