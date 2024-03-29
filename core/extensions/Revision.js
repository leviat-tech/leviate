import { computed, reactive } from 'vue';

class Revision {

  // handlers:
  //   autocommit(mutation, state): called on state change, when returns true will commit state
  //   committed(state): called when state is committed (note undo sometimes calls commit too)
  //   undone(): called after successful undo
  //   redone(): called after succesful redo
  constructor(max = 15, handlers) {
    this.max = max + 1;
    this.outdated = true;
    this.undos = reactive([]);
    this.redos = reactive([]);
    this.handlers = handlers || {};
    this.changed = this.changed.bind(this);

    this.redoable = computed(() => this.redos.length > 0);
    this.undoable = computed(() => this.undos.length > 1 || (this.undos.length === 1 && this.outdated));
  }

  initializeStore(store) {
    this.store = store;
    this.store.$subscribe(this.changed);
  }

  // save current state to undo stack
  commit() {
    if (!this.outdated) return;
    this.outdated = false;
    this.undos.push(this.snapshot());
    if (this.undos.length > this.max) {
      this.undos.shift();
    }

    if (this.handlers.committed) {
      this.handlers.committed(this.snapshot());
    }
  }

  // save current state and rewind to last commit
  undo() {
    if (!this.undoable) return;
    if (this.outdated) this.commit();
    this.redos.push(this.undos.pop());
    this.replace(this.undos[this.undos.length - 1]);

    if (this.handlers.undone) {
      this.handlers.undone(this.snapshot());
    }
  }

  // move fast forward to previous commit
  redo() {
    if (!this.redoable) return;
    const state = this.redos.pop();
    this.undos.push(state);
    this.replace(state);

    if (this.handlers.redone) {
      this.handlers.redone(this.snapshot());
    }
  }

  // return cloned copy of state
  snapshot() {
    return this.store.toJSON();
  }

  // replace current state with provided state
  replace(store) {
    this.store.replaceState(JSON.parse(JSON.stringify(store)));
  }

  // called when state changes
  changed(mutation, state) {
    this.outdated = true;
    if (this.handlers.autocommit && this.handlers.autocommit(mutation, state)) {
      this.commit();
      this.redos.length = 0;
    }
  }

  // clear revision undo / redo stack
  clear() {
    this.outdated = true;
    this.undos.length = 0;
    this.redos.length = 0;
  }
}

export default Revision;
