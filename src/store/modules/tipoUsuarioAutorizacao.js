import axios from "../../axios.js";

const getDefaultState = () => {
  return {
    tipoUsuarioAutorizacaoList: []
  };
};

const state = getDefaultState();

const getters = {
  tipoUsuarioAutorizacaoList: state => state.tipoUsuarioAutorizacaoList
};

const mutations = {
  resetState(state) {
    Object.assign(state, getDefaultState());
  },
  setTipoUsuarioAutorizacaoList(state, list) {
    state.tipoUsuarioAutorizacaoList = list;
  }
};

const actions = {
  resetState({ commit }) {
    commit("resetState");
  },
  async getTipoUsuarioAutorizacaoList({ commit }) {
    const { data } = await axios.get("/tipo-usuario/autorizacao");
    commit("setTipoUsuarioAutorizacaoList", data);
  },
  async insertTipoUsuarioAutorizacao({}, { cd_tipo_usua, cd_prod, cd_func, cd_func_acao }) {
    const { data } = await axios.post("/tipo-usuario/autorizacao", {
      cd_tipo_usua,
      cd_prod,
      cd_func,
      cd_func_acao
    });
    return data;
  },
  async deleteTipoUsuarioAutorizacao({}, { cd_tipo_usua, cd_prod, cd_func, cd_func_acao }) {
    const { data } = await axios.delete("/tipo-usuario/autorizacao", {
      data: { cd_tipo_usua, cd_prod, cd_func, cd_func_acao }
    });
    return data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
