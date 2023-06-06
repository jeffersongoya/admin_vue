import axios from "../../axios.js";

const getDefaultState = () => {
  return {
    tipoUsuarioList: []
  };
};

const state = getDefaultState();

const getters = {
  tipoUsuarioList: state => state.tipoUsuarioList
};

const mutations = {
  resetState(state) {
    Object.assign(state, getDefaultState());
  },
  setTipoUsuarioList(state, tipoUsuarioList) {
    state.tipoUsuarioList = tipoUsuarioList;
  }
};

const actions = {
  resetState({ commit }) {
    commit("resetState");
  },
  async getTipoUsuarioList({ commit }) {
    const { data } = await axios.get("/tipo-usuario");
    commit("setTipoUsuarioList", data);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
