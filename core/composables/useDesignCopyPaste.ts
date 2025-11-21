import { useToast } from './useToast';
import { transact, useRootStore } from '../store';
import { useMeta } from '../plugins/host';
import useEnvironment from './useEnvironment';
import { useRoute, useRouter } from 'vue-router';

function getAppName() {
  return useMeta().configurator.name;
}

export function useDesignCopyPaste() {
  const route = useRoute();
  const router = useRouter();

  function copyDesign() {
    const state = useRootStore().toJSON();
    state.appName = getAppName();
    const stateStr = JSON.stringify({ state, currentRoute: route }, null, 2);
    navigator.clipboard.writeText(stateStr);
    useToast().showToast('Design copied to clipboard. Use Ctrl+ Alt + Shift + V to load.');
  }

  async function pasteDesign() {
    let error = null;
    const stateStr = await navigator.clipboard.readText();
    const appName = getAppName();

    try {
      const { state, currentRoute } = JSON.parse(stateStr);

      if (state.appName !== appName) {
        throw new Error('Mismatching application name');
      }

      const rootStore = useRootStore();

      if (rootStore.serialization_version !== state.serialization_version) {
        console.warn('State serialization version does not match the current application version. Unexpected results may occur');
      }

      const isConfirmed = confirm('This will replace the design with the contents of the clipboard and all previous data will be lost. Are you sure?');

      if (isConfirmed) {
        const { appName, ...stateToLoad } = state;
        await router.replace('/');

        transact('Paste state', () => {
          rootStore.replaceState(stateToLoad);
          return router.replace(currentRoute);
        });
      }
    } catch (e) {
      console.error(e);
      error = `Could not read design from Clipboard. Please check that the clipboard content is a valid ${appName} design`;
    }

    if (error !== null) {
      useToast().showToast(error, { type: 'error' });
    }
  }

  window.addEventListener('keydown', async (e) => {
    const isGlobalKeyActive = e.shiftKey && e.ctrlKey && e.altKey;

    if (!isGlobalKeyActive) return;

    switch (e.key) {
      case 'C': return copyDesign();
      case 'V': {
        const { isLdsProd } = useEnvironment();

        if (isLdsProd) {
          return console.warn('Cannot paste design in production environment.');
        } else {
          return pasteDesign();
        }
      }
    }
  })
}
