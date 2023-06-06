import axios from "../../axios.js";

const actions = {
  async getChaveAcessoAPIList() {
    const { data } = await axios.get("/admin/chave-acesso-api");
    return data;
  },
  async getChaveAcessoAPIById({}, { id_empr, id_nivl }) {
    const params = { id_empr, id_nivl };
    const { data } = await axios.get("/admin/chave-acesso-api/byId", { params });
    return data;
  },
  async insertChaveAcessoAPI({}, { id_empr, id_nivl }) {
    const { data } = await axios.post("/admin/chave-acesso-api", {
      id_empr,
      id_nivl
    });
    return data;
  },
  async updateChaveAcessoAPI({}, { id_empr, id_nivl, fl_ativ }) {
    const { data } = await axios.put("/admin/chave-acesso-api", {
      id_empr,
      id_nivl,
      fl_ativ
    });
    return data;
  },
  async deleteChaveAcessoAPI({}, { id_empr, id_nivl }) {
    const { data } = await axios.delete("/admin/chave-acesso-api", {
      data: { id_empr, id_nivl }
    });
    return data;
  }
};

export default {
  namespaced: true,
  actions
};
