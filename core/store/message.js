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
    setMessage(text, type = 'info', additionalData = {}) {
      const { id, ...data } = additionalData;
      const messageId = (id === undefined) ? uuidv4() : id;
      this.messages[messageId] = { type, text, ...data };
      return messageId;
    },

    removeMessage(id) {
      delete this.messages[id];
    },

    setTemporaryMessage(text, type = 'info', category = 'global', durationSeconds = 5) {
      const id = this.setMessage(text, type, { category });

      setTimeout(this.removeMessage.bind(this, id), durationSeconds * 1000)
    },

    setTemporaryWarning(text, category, durationSeconds) {
      this.setTemporaryMessage(text, 'warning', category, durationSeconds);
    },

    setTemporaryError(text, category, durationSeconds) {
      this.setTemporaryMessage(text, 'error', category, durationSeconds);
    },

    setWarning(text, additionalData = { category: 'global' }) {
      return this.setMessage(text, 'warning', additionalData);
    },

    setError(text, additionalData = { category: 'global' }) {
      return this.setMessage(text, 'error', additionalData);
    },

    setConfigWarning(text) {
      return this.setWarning(text, { category: 'config' });
    },

    setConfigError(text) {
      return this.setError(text, { category: 'config' });
    },

    setGlobalWarning(text) {
      return this.setWarning(text, { category: 'global' });
    },

    setGlobalError(text) {
      return this.setError(text, { category: 'global' });
    },

    setCalculationWarning(modelId, entityId, path, warnings, additionalData) {
      const id = [modelId, entityId, path].join(':');
      return this.setWarning(warnings[0], { id, category: 'calculation', ...additionalData });
    },

    setCalculationErrors(modelId, entityId, path, errors, additionalData) {
      const id = [modelId, entityId, path].join(':');
      return this.setError(errors[0], { id, category: 'calculation', ...additionalData });
    },
  },
  getters: {
    filterMessagesByCategory(state) {
      return (category) => {
        return reduce(state.messages, (errors, message, id) => {
          return message.category === category ? [...errors, { id, ...message }] : errors;
        }, [])
      }
    },
    globalMessages(state) {
      return this.filterMessagesByCategory('global');
    },
    configErrors(state) {
      return this.filterMessagesByCategory('config');
    },
    calculationErrors(state) {
      return this.filterMessagesByCategory('calculation');
    }
  }
});
