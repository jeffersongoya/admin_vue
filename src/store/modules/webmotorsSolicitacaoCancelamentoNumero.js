import axios from "../../axios.js";

const actions = {
  async getSolicitacaoCancelamentoNumeroList() {
    const { data } = await axios.get("/admin/webmotors/solicitacao-cancelamento-numero");
    return data;
  },
  async updateSolicitacaoCancelamentoNumero({}, { id_soli_canc_telf, cd_stat, fl_envi }) {
    const { data } = await axios.put("/admin/webmotors/solicitacao-cancelamento-numero", {
      id_soli_canc_telf,
      cd_stat,
      fl_envi
    });
    return data;
  }
};

export default {
  namespaced: true,
  actions
};
