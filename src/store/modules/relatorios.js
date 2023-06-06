import moment from "moment";
import axios from "../../axios.js";

const actions = {
  async getTecbanRelatorioProcessamento({}, { dataInic, dataFinl }) {
    let params = {
      dataInicial: moment(dataInic).format("YYYY-MM-DD"),
      dataFinal: moment(dataFinl).format("YYYY-MM-DD")
    };

    const { data } = await axios.get("/clientes/flex/tecban/relatorio-processamento", {
      params
    });

    return data;
  },

  async getSerasaRelatorioCelulasReceptivas({}, { dataInic, dataFinl }) {
    let params = {
      dataInicial: moment(dataInic).format("YYYY-MM-DD"),
      dataFinal: moment(dataFinl).format("YYYY-MM-DD")
    };

    const { data } = await axios.get("/clientes/flex/serasa/relatorio-celulas-receptivas", {
      params
    });

    return data;
  },

  async getSerasaRelatorioTelevendasAtivoReceptivo({}, { dataInic, dataFinl }) {
    let params = {
      dataInicial: moment(dataInic).format("YYYY-MM-DD"),
      dataFinal: moment(dataFinl).format("YYYY-MM-DD")
    };

    const { data } = await axios.get(
      "/clientes/flex/serasa/relatorio-televendas-ativo-e-receptivo",
      {
        params
      }
    );

    return data;
  }
};

export default {
  namespaced: true,
  actions
};
