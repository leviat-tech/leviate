import logger from './extensions/logger';
import { useRootStore } from './store';
import { get, set } from 'lodash-es';
import { useMessageStore } from './store/message';
import { transact } from './store';

const parseInputId = (inputId) => {
  const segments = inputId.split('_');

  if (segments.length !== 3) logger.warn(`Input id ${inputId} does not match the format entity_id_path`);

  const [entityName, entityId, path] = segments;

  const model = useRootStore().modules.entities().models[entityName];
  const instance = model.find(entityId);

  return { instance, path };
}

export default {
  inputHandler: (id, val) => {
    const { instance, path } = parseInputId(id);

    transact(() => {
      set(instance, path, val);
    });
  },
  inputIdToValue: (id) => {
    const { instance, path } = parseInputId(id);

    return get(instance, path);
  },
  registerInputs: true,
  inputGetStatus: (id) => {
    if (!id) return;

    const { inputStatus } = useMessageStore();
    const [entityName, entityId, path] = id.split('_');
    const storeKey = [entityName, entityId].join('_');
    const errors = inputStatus[storeKey]?.[path];

    if (!errors) return;

    return {
      type: 'error',
      message: errors[0],
    }
  }
}