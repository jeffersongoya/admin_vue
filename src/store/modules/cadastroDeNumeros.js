import axios from "../../axios.js";

const actions = {
  async createNumeros({}, form) {
    const body = { ...form, telef: form.telef.map(e => "55" + e) };

    const { data } = await axios.post("admin/cadastro-de-numero", body);

    return data;
  }
};

export default {
  namespaced: true,
  actions
};
