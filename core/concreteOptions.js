import { get, set, snakeCase } from 'lodash-es';
import { validate } from 'uuid';
import logger from './extensions/logger';
import { useRootStore } from './store';
import { useMessageStore } from './store/message';
import { transact } from './store';
import { useLocalize } from './plugins/localize';


const parseInputId = (inputId) => {
  const segments = inputId.split(':');

  if (segments.length !== 2) logger.warn(`Input id ${inputId} does not match the format entity_id:path`);

  const [entityId, path] = segments;
  const store = useRootStore();
  // If the entityId is a uuid then get the instance from the entities store
  // Otherwise entityId is a store module
  const instance = validate(entityId) ? store.getEntityById(entityId) : store.modules[entityId]?.();

  return { instance, path };
}


const parseOptionsFromInputId = (inputId) => {
  const { instance, path } = parseInputId(inputId);

  return instance.coercedSchema.reach(path).options();
}

export default {
  inputHandler: (id, val) => {
    const { instance, path } = parseInputId(id);

    const pathSegments = path.split('.');

    transact(() => {
      if (pathSegments.length === 1) {
        return set(instance, path, val);
      }

      const newData = set(instance.$toJSON(), path, val);
      const rootKey = pathSegments[0];
      instance[rootKey] = newData[rootKey];
    });
  },
  inputIdToValue: (id) => {
    const { instance, path } = parseInputId(id);

    return get(instance, path);
  },
  inputIdToOptions: (id) => {
    return parseOptionsFromInputId(id);
  },
  registerInputs: true,
  inputGetStatus: (id) => {
    if (!id) return;

    const { inputStatus } = useMessageStore();
    let [entityId, path] = id.split(':');

    if (path) {
      path = path.replaceAll('.[', '[')
    }

    const errors = inputStatus[entityId]?.[path];

    if (!errors) return;

    return {
      type: 'error',
      message: errors[0],
    }
  },
  labelFormatter: (props) => {
    const { id, label } = props;
    const { $L } = useLocalize();

    if (label) return $L(snakeCase(label));

    const path = id.split(':')[1];

    if (!path) {
      logger.warn(`Could not generate label for input id '${id}'`);
      return null;
    }

    const labelPath = path.replace(/\./g, '_');
    return $L(snakeCase(labelPath));
  }
}

