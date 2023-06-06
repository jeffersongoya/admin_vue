const getDefaultState = () => {
  return {
    msg: false
  };
};

const state = getDefaultState();

const mutations = {
  resetState(state) {
    Object.assign(state, getDefaultState());
  },
  setMensagem(state, msg) {
    state.msg = msg;
  }
};

const actions = {
  resetState({ commit }) {
    commit("resetState");
  },
  block({ commit }, msg) {
    if (typeof msg === "undefined" || (msg && typeof msg === "boolean")) {
      msg = "Aguarde...";
    }
    commit("setMensagem", msg);
  }
};

const getters = {
  message: state => state.msg
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
