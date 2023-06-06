import axios from "../../axios.js";

const actions = {
  async getCxClientesList() {
    const { data } = await axios.get("/admin/cx/clientes");
    return data;
  },
  async insertCxClientes({}, { id_empr, id_nivl, ds_exte_id_clie }) {
    const { data } = await axios.post("/admin/cx/clientes", {
      id_empr,
      id_nivl,
      ds_exte_id_clie
    });
    return data;
  },
  async updateCxClientes({}, { id_empr, id_nivl, ds_exte_id_clie }) {
    const { data } = await axios.put("/admin/cx/clientes", {
      id_empr,
      id_nivl,
      ds_exte_id_clie
    });
    return data;
  },
  async deleteCxClientes({}, { id_empr, id_nivl }) {
    const { data } = await axios.delete("/admin/cx/clientes", {
      data: { id_empr, id_nivl }
    });
    return data;
  }
};

export default {
  namespaced: true,
  actions
};
