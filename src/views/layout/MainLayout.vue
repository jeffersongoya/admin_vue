<template>
  <div>
    <div>
      <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand href="#">Admin</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item-dropdown text="API">
              <b-dropdown-item to="/api/chave-acesso">Chave de acesso</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown text="Portal">
              <b-dropdown-item to="/portal/autorizacao">
                Autorização
              </b-dropdown-item>
              <b-dropdown-item to="/portal/cadastro-de-empresa">
                Cadastro de Empresa
              </b-dropdown-item>
              <b-dropdown-item to="/portal/cadastro-de-numeros">
                Cadastro de Números
              </b-dropdown-item>
              <b-dropdown-item to="/portal/emails-autenticados">
                E-mails Autenticados
              </b-dropdown-item>
              <b-dropdown-item to="/portal/produto-customizado">
                Produto Customizado
              </b-dropdown-item>
              <b-dropdown-item to="/portal/reprocessamento-comportamento">
                Reprocessamento Comportamento
              </b-dropdown-item>
              <b-dropdown-item to="/portal/relatorios">
                Relatórios
              </b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown text="CX">
              <b-dropdown-item to="/cx/clientes">Clientes</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown text="Webmotors">
              <b-dropdown-item to="/webmotors/solicitacao-compra-numero">
                Solicitação de compra de número
              </b-dropdown-item>
              <b-dropdown-item to="/webmotors/solicitacao-cancelamento-numero">
                Solicitação de cancelamento de número
              </b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown right>
              <template v-slot:button-content>
                <em>{{ usuarioAtual.ds_mail }}</em>
              </template>
              <b-dropdown-item href="#" @click="onSair">Sair</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters("auth", ["usuarioAtual"])
  },
  methods: {
    ...mapActions("auth", ["logout"]),
    onSair() {
      this.logout();
      this.$router.push("/login");
    }
  }
};
</script>
