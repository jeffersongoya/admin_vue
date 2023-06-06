import axios from "../../axios.js";

const actions = {
  async getSolicitacaoCompraNumeroList() {
    const { data } = await axios.get("/admin/webmotors/solicitacao-compra-numero");
    return data;
  },
  async updateSolicitacaoCompraNumero(
    {},
    { id_soli_comp_telf, cd_stat, fl_envi, ds_telf_list = [] }
  ) {
    const { data } = await axios.put("/admin/webmotors/solicitacao-compra-numero", {
      id_soli_comp_telf,
      cd_stat,
      fl_envi,
      ds_telf_list
    });
    return data;
  }
};

export default {
  namespaced: true,
  actions
};
