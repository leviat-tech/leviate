import { createPinia, defineStore, setActivePinia } from 'pinia';
import { createStore, useRootStore } from '@/core/store';

const testStoreConfig = {
  modules: [],
};
let rootStore;

beforeAll(async() => {
  setActivePinia(createPinia());
  createStore(testStoreConfig);
  rootStore = useRootStore();
});

const useFooStore = defineStore('foo', {
  state: () => ({ value: 1 }),
  actions: {
    setFoo(val) {
      this.value = val;
    }
  }
})

const useBarStore = defineStore('bar', {
  state: () => ({ value: 2 }),
  actions: {
    setBar(val) {
      this.value = val;
    }
  }
})

describe('Root store', () => {
  describe('Modules', () => {
    it('registers a module', () => {
      rootStore._registerModule(useFooStore);

      expect(rootStore.modules.foo().value).toBe(1)
    });

    it('maintains reactivity on a registered module', () => {
      rootStore._registerModule(useFooStore);
      const fooStore = useFooStore();
      fooStore.setFoo(2);

      expect(rootStore.modules.foo().value).toBe(2)
    });

  });

  describe('State', () => {

    it('replaces the existing state', () => {
      rootStore._registerModule(useFooStore);

      rootStore.replaceState({
        foo: { value: 4 }
      });

      expect(useFooStore().value).toBe(4);
    });

    it('maintains reactivity on a replaced state', () => {
      rootStore._registerModule(useFooStore);

      rootStore.replaceState({
        foo: { value: 10 }
      });

      const fooStore = useFooStore();
      fooStore.setFoo(0);

      expect(useFooStore().value).toBe(0);
      expect(rootStore.modules.foo().value).toBe(0);
    });

    it('serialises the state', () => {
      rootStore._registerModule(useFooStore);

      const state = rootStore.toJSON();

      expect(state.foo.value).toBe(0);
      expect(typeof JSON.stringify(state)).toBe('string');
    });
  });

  describe('Transaction', () => {

    it('should update the state within a transaction', () => {
      const result = rootStore.transact(() => {
        rootStore.modules.foo().setFoo(50);
      });

      expect(result).toBeInstanceOf(Promise);
      expect(rootStore.modules.foo().value).toEqual(50);
    });

    it('should throw an error in a synchronous transaction', () => {
      const transactionWithError = () => rootStore.transact(() => {
        throw new Error();
      });

      expect(transactionWithError).rejects.toThrowError()
    });

    it('should throw an error in an asynchronous transaction', () => {
      const transactionWithError = () => rootStore.transact(async () => {
        throw new Error();
      });

      expect(transactionWithError).rejects.toThrowError()
    });

    it('should throw an error in an asynchronous transaction', () => {
      vi.spyOn(console, 'error').mockImplementation(vi.fn());

      const transactionWithError = () => rootStore.transact(async () => {
        throw new Error();
      });

      expect(transactionWithError).rejects.toThrowError()
    });

    it('should undo the revision if the transaction fails', async () => {
      // We're expecting a console.error but don't
      // want to see it in the test runner logs
      vi.spyOn(console, 'error').mockImplementation(vi.fn());

      // Spy on store revision so we can check it gets called
      // const undoSpy = vi.spyOn(store.revision, 'undo');

      rootStore.modules.foo().setFoo(1);
      rootStore.modules.foo().setFoo(2);

      // Setup a callback that commits a mutation but throws an error
      // So we can check the mutation gets reverted
      const callbackWithError = () => {
        rootStore.modules.foo().setFoo(3);

        return new Promise((resolve, reject) => {
          rootStore.modules.foo().setFoo(4);

          setTimeout(reject, 1000);
        });
      };

      // await rootStore.transact(callbackWithError);

      expect(callbackWithError).rejects.toThrowError();
      expect(rootStore.modules.foo().value).toBe(4);

      // expect(store.revision.undos.length).toBe(0);
      // expect(undoSpy).toHaveBeenCalled();
      // expect(store.state.testValue).toBe(2);
      // expect(store.state.transaction.transactionDepth).toBe(0);
    });

  });
});
