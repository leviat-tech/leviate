import transaction from '@/core/store/transaction';
import revision from '@/core/store/plugins/revision';

let store;
let transact;
let commitSetValue;


beforeEach(() => {
  const localVue = createLocalVue();
  localVue.use(Vuex);

  store = new Vuex.Store({
    state: {
      testValue: 0,
    },
    mutations: {
      SET_TEST_VALUE(state, value) {
        state.testValue = value;
      },
    },
    plugins: [revision],
    modules: {
      transaction,
    },
  });

  transact = (callback) => store.dispatch('transaction/transact', callback);
  commitSetValue = (value) => store.commit('SET_TEST_VALUE', value);
});

describe.skip('store/transaction', () => {
  describe('actions/transact', () => {
    it('should successfully call the transaction function', () => {
      const value = 50;
      const result = transact(() => commitSetValue(50));

      expect(result).toBeInstanceOf(Promise);
      expect(store.state.testValue).toEqual(value);
    });

    it('should undo the revision if the transaction fails', async () => {
      // We're expecting a console.error but don't
      // want to see it in the test runner logs
      jest.spyOn(console, 'error').mockImplementation(jest.fn());

      // Spy on store revision so we can check it gets called
      const undoSpy = jest.spyOn(store.revision, 'undo');

      commitSetValue(1);
      commitSetValue(2);

      // Setup a callback that commits a mutation but throws an error
      // So we can check the mutation gets reverted
      const callbackWithError = () => {
        commitSetValue(3);

        return new Promise((resolve, reject) => {
          setTimeout(() => {
            commitSetValue(4);
            reject();
          }, 1000);
        });
      };

      await transact(callbackWithError);

      // expect(store.revision.undos.length).toBe(0);
      expect(undoSpy).toHaveBeenCalled();
      expect(store.state.testValue).toBe(2);
      expect(store.state.transaction.transactionDepth).toBe(0);
    });

    it('should throw a transaction error', () => {
      jest.spyOn(console, 'error').mockImplementation(jest.fn());

      // Create a callback with an unresolved promise so we can test
      // for nested interactions. We don't want the promise to resolve as
      // we're only concerned with testing for the TransactionError
      const callbackWithUnresolvedPromise = () => new Promise((resolve) => {});
      const callbackWithError = () => { throw new Error(); };
      const nestedAction = () => transact(callbackWithError);

      transact(callbackWithUnresolvedPromise);

      expect(nestedAction).rejects.toHaveProperty('name', 'TransactionError');
    });
  });
});
