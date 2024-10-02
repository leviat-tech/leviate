import { get, set, snakeCase } from 'lodash-es';
import { validate } from 'uuid';
import logger from './extensions/logger';
import { useRootStore } from './store';
import { useMessageStore } from './store/message';
import { transact } from './store';
import { useLocalize } from './plugins/localize';


const parseInputId = (inputId) => {
  const segments = inputId.split(':');

  if (segments.length !== 2) {
    return {};
  }

  const [entityId, path] = segments;
  const store = useRootStore();
  // If the entityId is a uuid then get the instance from the entities store
  // Otherwise entityId is a store module
  const isModel = validate(entityId);
  const instance = isModel ? store.getEntityById(entityId) : store.modules[entityId]?.();

  return { instance, path, isModel };
}

export default {
  inputHandler: (id, val) => {
    const { instance, path } = parseInputId(id);

    if (!instance) return;

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

    if (!instance) return;

    return get(instance, path);
  },
  inputIdToOptions: (id) => {
    const { instance, path } = parseInputId(id);

    if (!instance) return;

    return instance.coercedSchema.reach(path).options();
  },
  registerInputs: true,
  inputGetStatus: (id) => {
    if (!id) return;

    const { instance, path, isModel } = parseInputId(id);

    if (!instance || !isModel) return;

    const errorPath = path?.replaceAll('.[', '[');
    const error = instance.getInputErrorByPath(errorPath);

    if (!error) return;

    return {
      type: 'error',
      message: error.text,
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

