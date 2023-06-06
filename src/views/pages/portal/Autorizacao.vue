<template>
  <b-container fluid>
    <b-row class="mt-4 mb-3">
      <b-col><h4>Portal - Autorização</h4></b-col>
    </b-row>
    <b-card class="card-default" no-body>
      <b-card-body class="p-0 container-fluid">
        <b-row>
          <b-col>
            <b-form class="p-3" inline @submit.stop.prevent>
              <font-awesome-icon icon="user" />
              <span class="mx-2">
                Autorização
              </span>
            </b-form>
          </b-col>
        </b-row>

        <b-card-text>
          <b-tabs>
            <b-tab
              v-for="(tipoUsuario, index) in tipoUsuarioList"
              :key="index"
              :title="tipoUsuario.nm_tipo_usua"
            >
              <b-table
                striped
                hover
                :items="
                  filter(tipoUsuarioAutorizacaoList, {
                    cd_tipo_usua: tipoUsuario.cd_tipo_usua
                  })
                "
                :fields="[
                  {
                    key: 'nm_prod',
                    label: 'Produto',
                    sortable: true
                  },
                  {
                    key: 'nm_func',
                    label: 'Funcionalidade',
                    sortable: true
                  },
                  {
                    key: 'nm_func_acao',
                    label: 'Ação',
                    sortable: true
                  },
                  {
                    key: 'fl_auth',
                    label: 'Autorização',
                    sortable: true
                  }
                ]"
              >
                <template slot="cell(fl_auth)" slot-scope="row">
                  <b-button
                    v-if="row.item.fl_auth"
                    variant="danger"
                    size="sm"
                    @click="onDeleteClick(row.item)"
                  >
                    Excluir
                  </b-button>
                  <b-button
                    v-if="!row.item.fl_auth"
                    variant="success"
                    size="sm"
                    @click="onInsertClick(row.item)"
                  >
                    Incluir
                  </b-button>
                </template>
              </b-table>
            </b-tab>
          </b-tabs>
        </b-card-text>
      </b-card-body>
    </b-card>
  </b-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import filter from "lodash/filter";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters("tipoUsuarioAutorizacao", ["tipoUsuarioAutorizacaoList"]),
    ...mapGetters("tipoUsuario", ["tipoUsuarioList"])
  },
  watch: {},
  async mounted() {
    try {
      this.block();
      await Promise.all([this.getTipoUsuarioList(), this.getTipoUsuarioAutorizacaoList()]);
    } catch (err) {
      this.$noty.error(err.response ? err.response.data : err.message ? err.message : err);
    } finally {
      this.block(false);
    }
  },
  methods: {
    ...mapActions("block", ["block"]),
    ...mapActions("tipoUsuarioAutorizacao", [
      "getTipoUsuarioAutorizacaoList",
      "insertTipoUsuarioAutorizacao",
      "deleteTipoUsuarioAutorizacao"
    ]),
    ...mapActions("tipoUsuario", ["getTipoUsuarioList"]),
    filter,
    async onInsertClick(tipoUsuarioAutorizacao) {
      let r = await this.insertTipoUsuarioAutorizacao(tipoUsuarioAutorizacao);
      if (!r.return_code) this.getTipoUsuarioAutorizacaoList();
      this.$noty.show(r.return_msgm, r.return_code ? "warning" : "success");
    },
    async onDeleteClick(tipoUsuarioAutorizacao) {
      let r = await this.deleteTipoUsuarioAutorizacao(tipoUsuarioAutorizacao);
      if (!r.return_code) this.getTipoUsuarioAutorizacaoList();
      this.$noty.show(r.return_msgm, r.return_code ? "warning" : "success");
    }
  }
};
</script>
