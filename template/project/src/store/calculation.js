const state = {};

const mutations = {};

const actions = {
  initialize: ({ commit, state: s }, docs) => {
    // Perform some checks here when loading a previously saved state
  },
};

const documents = {
  namespaced: true,
  state,
  mutations,
  actions,
};
export default documents;
