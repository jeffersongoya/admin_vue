import axios from "../../axios.js";

const actions = {
  async getListEmpresa() {
    const { data } = await axios.get("admin/cadastro-de-empresa");

    return data.map(e => {
      let date = null;

      if (e.ts_cadm) {
        date = new Date(e.ts_cadm).toLocaleDateString("pt-br");
      }

      return { ...e, ts_cadm: date };
    });
  },
  async getEmpresaById({}, params) {
    const { data } = await axios.get("admin/cadastro-de-empresa/byId", {
      params
    });

    return data;
  },
  async createEmpresa({}, form) {
    const { data } = await axios.post("admin/cadastro-de-empresa", form);

    return data;
  },
  async updateEmpresa({}, form) {
    const { data } = await axios.put("admin/cadastro-de-empresa", form);

    return data;
  }
};

export default {
  namespaced: true,
  actions
};
