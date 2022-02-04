import Vue from 'vue';
import { make } from 'vuex-pathify';


class TransactionError extends Error {}

export default function transaction(store) {
  const state = {
    transactionDepth: 0,
  };

  const mutations = {
    ...make.mutations(state),
    cleanUpKilledTransaction(s) {
      Vue.set(s, 'transactionDepth', 0);
    },
  };

  const actions = {
    async transact({ state: s, commit }, f) {
      commit('SET_TRANSACTION_DEPTH', s.transactionDepth + 1);
      const currentTransactionDepth = s.transactionDepth;
      try {
        await f();
        commit('SET_TRANSACTION_DEPTH', s.transactionDepth - 1);
      } catch (e) {
        if (!(e instanceof TransactionError)) {
          console.error(e);
        }
        if (currentTransactionDepth > 1) { // if we're in a nested transaction, propagate an error;
          throw new TransactionError();
        } else { // otherwise, undo to the last committed state;
          store.revision.undo();
          commit('cleanUpKilledTransaction');
        }
      }
    },
    async initialize({ commit }) {
      commit('SET_TRANSACTION_DEPTH', 0);
    },
  };

  return {
    namespaced: true, state, mutations, actions,
  };
}
