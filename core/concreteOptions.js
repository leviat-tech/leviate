import logger from './extensions/logger';
import { useRootStore } from './store';
import { get, set } from 'lodash-es';
import { useMessageStore } from './store/message';
import { transact } from './store';
import { useLocalize } from './plugins/host';


const parseInputId = (inputId) => {
  const segments = inputId.split('_');

  if (segments.length !== 2) logger.warn(`Input id ${inputId} does not match the format entity_id_path`);

  const [entityId, path] = segments;

  const store = useRootStore();
  const instance = store.getEntityById(entityId);

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
    const [entityId, path] = id.split('_');
    const errors = inputStatus[entityId]?.[path];

    if (!errors) return;

    return {
      type: 'error',
      message: errors[0],
    }
  },
  labelFormatter: (label) => {
    const { $L } = useLocalize();
    return $L(label.toLowerCase());
  }
}