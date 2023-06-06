import axios from "../../axios.js";

const actions = {
  async getProdutoCustomizadoList() {
    const { data } = await axios.get("/admin/produto-customizado");
    return data;
  },
  async getProdutoCustomizadoMenuById({}, { id_prod_cust }) {
    const params = { id_prod_cust };
    const { data } = await axios.get("/admin/produto-customizado/byId", { params });
    return data;
  },
  async updateProdutoCustomizadoMenu({}, { formData, id_prod_cust }) {
    const { data } = await axios.post("/admin/produto-customizado/menu", {
      formData,
      id_prod_cust
    });
    return data;
  },
  async insertProdutoCustomizado({}, { id_empr, id_nivl, cd_prod }) {
    const { data } = await axios.post("/admin/produto-customizado", {
      id_empr,
      id_nivl,
      cd_prod
    });
    return data;
  },
  async deleteProdutoCustomizado({}, { id_prod_cust }) {
    const { data } = await axios.delete("/admin/produto-customizado", {
      data: { id_prod_cust }
    });
    return data;
  }
};

export default {
  namespaced: true,
  actions
};
