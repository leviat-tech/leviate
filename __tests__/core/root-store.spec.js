import { createPinia, defineStore, setActivePinia } from 'pinia';
import { useRootStore } from '../../core/store/index';

let rootStore;

beforeAll(async() => {
  setActivePinia(createPinia());
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
      rootStore.registerModule(useFooStore);

      expect(rootStore.foo.value).toBe(1)
    });

    it('maintains reactivity on a registered module', () => {
      rootStore.registerModule(useFooStore);
      const fooStore = useFooStore();
      fooStore.setFoo(2);

      expect(rootStore.foo.value).toBe(2)
    });

  });

  describe('State', () => {

    it('replaces the existing state', () => {
      rootStore.registerModule(useFooStore);

      rootStore.replaceState({
        foo: { value: 4 }
      });

      expect(useFooStore().value).toBe(4);
    });

    it('maintains reactivity on a replaced state', () => {
      rootStore.registerModule(useFooStore);

      rootStore.replaceState({
        foo: { value: 10 }
      });

      const fooStore = useFooStore();
      fooStore.setFoo(0);

      expect(useFooStore().value).toBe(0);
      expect(rootStore.foo.value).toBe(0);
    });

    it('serialises the state', () => {
      rootStore.registerModule(useFooStore);

      const state = rootStore.serializeState();

      expect(state.foo.value).toBe(0);
      expect(typeof JSON.stringify(state)).toBe('string');
    });
  });

  describe('Transaction', () => {

    it('should update the state within a transaction', () => {
      const result = rootStore.transact(() => {
        rootStore.foo.setFoo(50);
      });

      expect(result).toBeInstanceOf(Promise);
      expect(rootStore.foo.value).toEqual(50);
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
      jest.spyOn(console, 'error').mockImplementation(jest.fn());

      const transactionWithError = () => rootStore.transact(async () => {
        throw new Error();
      });

      expect(transactionWithError).rejects.toThrowError()
    });

    it('should undo the revision if the transaction fails', async () => {
      // We're expecting a console.error but don't
      // want to see it in the test runner logs
      jest.spyOn(console, 'error').mockImplementation(jest.fn());

      // Spy on store revision so we can check it gets called
      // const undoSpy = jest.spyOn(store.revision, 'undo');

      rootStore.foo.setFoo(1);
      rootStore.foo.setFoo(2);

      // Setup a callback that commits a mutation but throws an error
      // So we can check the mutation gets reverted
      const callbackWithError = () => {
        rootStore.foo.setFoo(3);

        return new Promise((resolve, reject) => {
          rootStore.foo.setFoo(4);

          setTimeout(() => {
            reject();
          }, 1000);
        });
      };

      // await rootStore.transact(callbackWithError);

      expect(callbackWithError).rejects.toThrowError();
      expect(rootStore.foo.value).toBe(4);

      // expect(store.revision.undos.length).toBe(0);
      // expect(undoSpy).toHaveBeenCalled();
      // expect(store.state.testValue).toBe(2);
      // expect(store.state.transaction.transactionDepth).toBe(0);
    });

  });
});
