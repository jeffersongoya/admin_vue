import jwtDecode from "jwt-decode";
import axios from "../../axios.js";
import { init } from "../plugins/localStorage";

const getDefaultState = () => {
  return {
    token: init
  };
};

const state = getDefaultState();

const getters = {
  usuarioAtual(state) {
    if (!state.token) return {};
    const { id_usua, id_nivl, ds_mail, ds_nome, ds_loca, id_empr, fl_admn, ts_tria } = jwtDecode(
      state.token
    );
    return {
      id_usua,
      id_nivl,
      ds_mail,
      ds_nome,
      ds_loca,
      id_empr,
      fl_admn,
      ts_tria
    };
  }
};

const mutations = {
  resetState(state) {
    Object.assign(state, getDefaultState());
  },
  setToken(state, token) {
    state.token = token;
  },
  resetToken(state) {
    state.token = "";
  }
};

const actions = {
  resetState({ commit }) {
    commit("resetState");
  },
  async login({ commit }, usuario) {
    const { data } = await axios.post("/auth", usuario);
    commit("setToken", data.token);
  },
  async check() {
    await axios.get("/auth/check");
  },
  logout({ commit }) {
    commit("resetToken");
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
