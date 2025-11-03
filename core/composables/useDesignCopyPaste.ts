import { useToast } from './useToast';
import { useRootStore } from '../store';
import { useMeta } from '../plugins/host';

function getAppName() {
  return useMeta().configurator.name;
}

function copyDesign() {
  const state = useRootStore().toJSON();
  state.appName = getAppName();
  const stateStr = JSON.stringify(state, null, 2);
  navigator.clipboard.writeText(stateStr);
  useToast().showToast('Design copied to clipboard. Use Ctrl+ Alt + Shift + V to load.');
}

async function pasteDesign() {
  let error = null;
  const stateStr = await navigator.clipboard.readText();
  const appName = getAppName();

  try {
    const state = JSON.parse(stateStr);

    if (state.appName !== appName) {
      throw new Error('Mismatching application name');
    }

    const isConfirmed = confirm('This will replace the design with the contents of the clipboard and all previous data will be lost. Are you sure?');

    if (isConfirmed) {
      const { appName, ...stateToLoad } = state;
      useRootStore().replaceState(stateToLoad);
    }
  } catch (e) {
    console.error(e);
    error = `Could not read design from Clipboard. Please check that the clipboard content is a valid ${appName} design`;
  }

  if (error !== null) {
    useToast().showToast(error, { type: 'error' });
  }
}

export function useDesignCopyPaste() {
  window.addEventListener('keydown', async (e) => {
    const isGlobalKeyActive = e.shiftKey && e.ctrlKey && e.altKey;

    if (!isGlobalKeyActive) return;

    switch (e.key) {
      case 'C': return copyDesign();
      case 'V': return pasteDesign();
    }
  })
}
