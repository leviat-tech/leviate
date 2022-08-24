import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

import { reduce } from 'lodash-es';

/**
 * Contains system messages including global, calculation and form input errors and warnings
 */
export const useMessageStore = defineStore('messages', {
  state: () => ({
    inputStatus: {},
    messages: {},
  }),
  actions: {
    setMessage(type = 'info', text, additionalData = {}) {
      const { id, ...data } = additionalData;
      const messageId = (id === undefined) ? uuidv4() : id;
      this.messages[messageId] = { type, text, ...data };
      return id;
    },

    removeMessage(id) {
      delete this.messages[id];
    },

    setTemporaryMessage(type = 'info', text, durationSeconds = 5) {
      const id = this.setMessage(type, text, { global: true });

      setTimeout(this.removeMessage.bind(this, id), durationSeconds * 1000)
    },

    setTemporaryWarning(text, durationSeconds = 5) {
      this.setTemporaryMessage('warning', text, durationSeconds);
    },

    setTemporaryError(text, durationSeconds = 5) {
      this.setTemporaryMessage('error', text, durationSeconds);
    },

    setWarning(text, additionalData) {
      return this.setMessage('warning', text, additionalData);
    },

    setError(text, additionalData) {
      return this.setMessage('error', text, additionalData);
    },

    setConfigWarning(text) {
      return this.setWarning(text, { config: true });
    },

    setConfigError(text) {
      return this.setError(text, { config: true });
    },

    setGlobalWarning(text) {
      return this.setWarning(text, { global: true });
    },

    setGlobalError(text) {
      return this.setError(text, { global: true });
    },

    setCalculationWarning(modelId, entityId, path, warnings, additionalData) {
      const id = [modelId, entityId, path].join('_');
      return this.setWarning(warnings[0], { id, calculation: true, ...additionalData });
    },

    setCalculationErrors(modelId, entityId, path, errors, additionalData) {
      const id = [modelId, entityId, path].join('_');
      return this.setError(errors[0], { id, calculation: true, ...additionalData });
    },
  },
  getters: {
    filterMessagesByType(state) {
      return (type) => {
        return reduce(state.messages, (errors, message, id) => {
          return message[type] ? [...errors, { id, ...message }] : errors;
        }, [])
      }
    },
    globalErrors(state) {
      return this.filterMessagesByType('global');
    },
    configErrors(state) {
      return this.filterMessagesByType('config');
    },
    calculationErrors(state) {
      return this.filterMessagesByType('calculation');
    }
  }
});
