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
    const dontUndo = (val, key) => key.startsWith('settings.')

    const cleanPatch = {
      newValue: omitBy(patch.newValue, dontUndo),
      oldValue: omitBy(patch.oldValue, dontUndo)
    };

    if (isEmpty(cleanPatch.newValue) || isEmpty(cleanPatch.oldValue)) return;

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

    this.applyPatch(undoItem.oldValue);
  }

  redo() {
    if (!this.redoable) return;
    const redoItem = this.redos.pop();
    this.undos.push(redoItem);

    this.applyPatch(redoItem.newValue);
  }

  applyPatch(patch) {
    const { transactionDepth, ...state } = this.store.toJSON();

    each(patch, (val, key) => {
      if (val === undefined) {
        unset(state, key);
      } else {
        set(state, key, val);
      }
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
