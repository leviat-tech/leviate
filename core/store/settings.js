import { make } from 'vuex-pathify';


const state = {
  configName: '',
  locale: '',
  clientNotes: '',
  internalNotes: '',
};

const mutations = make.mutations(state);

const actions = {
  initialize: ({ commit }, { name, locale }) => {
    commit('SET_CONFIG_NAME', name);
    commit('SET_LOCALE', locale);
  },
};

const settings = {
  namespaced: true,
  state,
  mutations,
  actions,
};

export default settings;
