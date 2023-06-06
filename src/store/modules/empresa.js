import axios from "../../axios.js";

const actions = {
  async getEmpresaList() {
    const { data } = await axios.get("/empresa");
    return data;
  }
};

export default {
  namespaced: true,
  actions
};
