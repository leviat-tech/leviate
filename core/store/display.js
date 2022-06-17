import { defineStore } from 'pinia';



const state = {
  forms: {},
  currentTool: 'select',
};

const mutations = {
  ...make.mutations(state),
  openForm(s, id) {
    Vue.set(s.forms, id, true);
  },
  closeForm(s, id) {
    Vue.set(s.forms, id, false);
  },
  setForm(s, { id, value }) {
    Vue.set(s.forms, id, value);
  },
};

const actions = {
  openForm({ commit }, id) {
    commit('openForm', id);
  },
  closeForm({ commit }, id) {
    commit('closeForm', id);
  },
  setForm({ commit }, payload) {
    commit('setForm', payload);
  },
};

const display = {
  namespaced: true,
  state,
  mutations,
  actions,
};

export default display;
