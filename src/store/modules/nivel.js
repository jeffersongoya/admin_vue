import axios from "../../axios.js";

const actions = {
  async getNivelList() {
    const { data } = await axios.get("/nivel/adm");
    return data;
  }
};

export default {
  namespaced: true,
  actions
};
