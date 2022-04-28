import { createLocalVue, mount } from '@vue/test-utils';
import Concrete from '@crhio/concrete';
import { createStore, initializeStore } from '@crhio/leviate/store/index';
import projectStoreConfig from '@/core/store';
import KSettingsModal from '@/core/components/layout/toolbar/k-settings-modal';
import { $host } from '../mocks';


let modal;
let store;

beforeEach(() => {
  const localVue = createLocalVue();
  store = createStore(localVue, projectStoreConfig);
  localVue.use(Concrete, { size: 'sm' });

  modal = mount(KSettingsModal, {
    localVue,
    store,
    mocks: {
      $host,
    },
  });
});


describe.skip('Settings', () => {
  it('should open the settings modal', () => {
    modal.vm.open();
    expect(modal.vm.showModal).toBe(true);
  });

  it('should update clientNotes', async () => {
    modal.vm.open();
    await modal.vm.$nextTick();
    const testClientNotesValue = 'Test client notes';
    const inputWrapper = modal.find('.input__client-notes textarea');
    await inputWrapper.setValue(testClientNotesValue);
    modal.vm.save();

    expect(store.state.settings.clientNotes).toBe(testClientNotesValue);
  });

  it('should update internalNotes', async () => {
    modal.vm.open();
    await modal.vm.$nextTick();

    const testInternalNotesValue = 'Test internal notes';
    const inputWrapper = modal.find('.input__internal-notes textarea');
    await inputWrapper.setValue(testInternalNotesValue);
    modal.vm.save();

    expect(store.state.settings.internalNotes).toBe(testInternalNotesValue);
  });

  it('should disable the locale input', async () => {
    modal.vm.open();
    await modal.vm.$nextTick();

    const inputWrapper = modal.find('.input__locale input');

    expect(inputWrapper.element.disabled).toBe(true);
  });

  it('should update configName', async () => {
    modal.vm.open();
    await modal.vm.$nextTick();

    const testConfigNameValue = 'Test config name';
    const inputWrapper = modal.find('.input__config-name input');
    await inputWrapper.setValue(testConfigNameValue);
    const $hostSpy = jest.spyOn(modal.vm.$host, 'setName');
    const setNameSpy = jest.spyOn(modal.vm, 'setName');

    // Needs to be async to wait for call to $host
    await modal.vm.save();

    expect(setNameSpy).toHaveBeenCalled();
    expect($hostSpy).toHaveBeenCalledWith(testConfigNameValue);
    expect(store.state.settings.configName).toBe(testConfigNameValue);
  });
});
