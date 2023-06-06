import axios from "../../axios.js";

const actions = {
  async getQuantidadeRegistros({}, { id_empr, id_nivl, dt_inic, dt_finl }) {
    const params = { id_empr, id_nivl, dt_inic, dt_finl };
    const { data } = await axios.get("/admin/reprocessamento-comportamento", {
      params
    });
    return data;
  },
  async reprocessarComportamentos({}, { id_empr, id_nivl, dt_inic, dt_finl }) {
    const { data } = await axios.post("/admin/reprocessamento-comportamento", {
      id_empr,
      id_nivl,
      dt_inic,
      dt_finl
    });
    return data;
  }
};

export default {
  namespaced: true,
  actions
};
