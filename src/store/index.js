import Vue from "vue";
import Vuex from "vuex";

import auth from "./modules/auth";
import block from "./modules/block";
import empresa from "./modules/empresa";
import nivel from "./modules/nivel";
import chaveAcessoAPI from "./modules/chaveAcessoAPI";
import emailsAutenticados from "./modules/emailsAutenticados";
import cxClientes from "./modules/cxClientes";
import webmotorsSolicitacaoCompraNumero from "./modules/webmotorsSolicitacaoCompraNumero";
import webmotorsSolicitacaoCancelamentoNumero from "./modules/webmotorsSolicitacaoCancelamentoNumero";
import produtoCustomizado from "./modules/produtoCustomizado";
import cadastroDeNumeros from "./modules/cadastroDeNumeros";
import cadastroDeEmpresa from "./modules/cadastroDeEmpresa";
import reprocessamentoComportamento from "./modules/reprocessamentoComportamento";
import relatorios from "./modules/relatorios";
import tipoUsuario from "./modules/tipoUsuario";
import tipoUsuarioAutorizacao from "./modules/tipoUsuarioAutorizacao";

import localStoragePlugin from "./plugins/localStorage";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    block,
    empresa,
    nivel,
    chaveAcessoAPI,
    emailsAutenticados,
    cxClientes,
    webmotorsSolicitacaoCompraNumero,
    webmotorsSolicitacaoCancelamentoNumero,
    produtoCustomizado,
    cadastroDeNumeros,
    cadastroDeEmpresa,
    reprocessamentoComportamento,
    relatorios,
    tipoUsuario,
    tipoUsuarioAutorizacao
  },
  plugins: [localStoragePlugin]
});
