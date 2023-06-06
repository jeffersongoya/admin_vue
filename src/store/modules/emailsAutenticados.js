import axios from "../../axios.js";

const actions = {
  async getEmailsAutenticadosList() {
    const { data } = await axios.get("/admin/emails-autenticados");
    return data;
  },
  async insertEmailsAutenticados({}, { id_empr, id_nivl, ds_mail, ds_acce_toke, ds_acco_id }) {
    const { data } = await axios.post("/admin/emails-autenticados", {
      id_empr,
      id_nivl,
      ds_mail,
      ds_acce_toke,
      ds_acco_id
    });
    return data;
  },
  async updateEmailsAutenticados(
    {},
    { id_empr_nivl_mail, id_nivl, ds_mail, ds_acce_toke, ds_acco_id }
  ) {
    const { data } = await axios.put("/admin/emails-autenticados", {
      id_empr_nivl_mail,
      id_nivl,
      ds_mail,
      ds_acce_toke,
      ds_acco_id
    });
    return data;
  },
  async deleteEmailsAutenticados({}, { id_empr_nivl_mail }) {
    const { data } = await axios.delete("/admin/emails-autenticados", {
      data: { id_empr_nivl_mail }
    });
    return data;
  }
};

export default {
  namespaced: true,
  actions
};
