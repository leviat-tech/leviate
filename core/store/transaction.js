import { defineStore } from 'pinia';

class TransactionError extends Error {
  constructor() {
    super();
    this.name = 'TransactionError';
  }
}


defineStore({
  state: () => ({
    transactionDepth: 0,
  }),
  actions: {
    async transact({ state: s, commit }, f) {
      this.transactionDepth++;
      const currentTransactionDepth = s.transactionDepth;
      try {
        await f();
        this.transactionDepth--;
      } catch (e) {
        if (!(e instanceof TransactionError)) {
          console.error(e);
        }
        if (currentTransactionDepth > 1) { // if we're in a nested transaction, propagate an error;
          throw new TransactionError();
        } else { // otherwise, undo to the last committed state;
          this.revision.undo();
          this.transactionDepth = 0;
        }
      }
    },
    async initialize({ commit }) {
      this.transactionDepth = 0;
    },
  }
});

export default {
  namespaced: true, state, mutations, actions,
};
