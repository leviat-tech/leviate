// inspired by https://github.com/anthonygore/vuex-undo-redo
import Vue from 'vue';

/**
 * @typedef { Object } Handlers
 * @property { Function<mutation: object, state: object> } autocommit - called on state change. Return true to commit the state to the revision history
 * @property { Function<state> } committed(mutation) - called when state is committed
 * @property { Function } undone - called after successful undo
 * @property { Function } redone - called after succesful redo
 *
 * @param { VuexStore } store
 * @param { number } maxSteps
 * @param { Handlers } handlers
 * @returns { Vue }
 */
export function createRevision(store, maxSteps, handlers) {
  return new Vue({
    created() {
      this.store = store;
      this.maxSteps = maxSteps;
      this.handlers = handlers || {};

      window.rev = this;

      this.store.subscribe(this.onStoreUpdated);
    },
    data() {
      return {
        undos: [],
        redos: [],
        isNewUpdate: true,
      };
    },
    computed: {
      undoable() {
        return this.undos.length > 1;
      },
      redoable() {
        return this.redos.length > 0;
      },
    },
    methods: {
      snapshot() {
        return JSON.parse(JSON.stringify(this.store.state));
      },
      replace(store) {
        this.store.replaceState(JSON.parse(JSON.stringify(store)));
      },
      onStoreUpdated(mutation, state) {
        const stateStr = JSON.stringify(state);
        const storeHasUpdated = stateStr !== this.previousStateStr;

        this.previousStateStr = stateStr;

        const shouldCommit =
          this.isNewUpdate &&
          storeHasUpdated &&
          this.handlers.autocommit?.(mutation, state);

        if (shouldCommit) {
          this.redos = [];
          this.commit();
        }
      },
      commit() {
        this.undos.push(this.snapshot());
        if (this.undos.length > this.maxSteps) {
          this.undos.shift();
        }

        if (this.handlers.committed) {
          this.handlers.committed(this.snapshot());
        }
      },
      undo() {
        if (!this.undoable) return;

        this.isNewUpdate = false;

        this.redos.push(this.undos.pop());
        this.replace(this.undos[this.undos.length - 1]);

        if (this.handlers.undone) {
          this.handlers.undone(this.snapshot());
        }

        this.isNewUpdate = true;
      },

      redo() {
        if (!this.redoable) return;

        this.isNewUpdate = false;

        const state = this.redos.pop();
        this.undos.push(state);
        this.replace(state);

        if (this.handlers.redone) {
          this.handlers.redone(this.snapshot());
        }

        this.isNewUpdate = true;
      }
    }
  });
}
