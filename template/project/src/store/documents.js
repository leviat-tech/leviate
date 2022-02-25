import { make } from 'vuex-pathify';
import merge from 'lodash/merge';
import overview from '@/schema/documents/overview';

const templates = {
  overview: () => overview.default(),
};

const state = {
  types: {}, // TODO: does everything need to be nested into "types"?
};

const mutations = make.mutations(state);

const actions = {
  initialize: ({ commit, state: s }, docs) => {
    const defaultState = docs.reduce((obj, doc) => ({
      ...obj,
      [doc.meta.template]: { ...templates[doc.meta.template](), generating: false },
    }), {});

    const docState = merge(
      defaultState,
      s.types,
    );

    commit('SET_TYPES', docState);
  },
};

const documents = {
  namespaced: true,
  state,
  mutations,
  actions,
  templates,
};
export default documents;
