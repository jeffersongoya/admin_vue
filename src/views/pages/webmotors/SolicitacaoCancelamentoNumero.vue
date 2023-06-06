<template>
  <b-container fluid>
    <h4>Webmotors - Solicitação de cancelamento de número</h4>
    <b-card class="mb-3" body-class="p-0">
      <b-table
        striped
        hover
        :items="solicitacaoCancelamentoNumeroList"
        :fields="solicitacaoCancelamentoNumeroFields"
        sort-by="ts_cadm"
        class="mb-0"
      >
        <template v-slot:cell(detalhes)="row">
          <div v-if="row.item.cd_stat == 'pend'" class="w-100 text-right">
            <b-button
              variant="success"
              size="sm"
              :style="{ width: '80px' }"
              @click="update(row.item, 'ok')"
            >
              Concluir
            </b-button>
            <b-button
              variant="danger"
              size="sm"
              :style="{ width: '90px' }"
              class="ml-3"
              @click="update(row.item, 'canc')"
            >
              Rejeitar
            </b-button>
          </div>
        </template>
      </b-table>
    </b-card>
  </b-container>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      solicitacaoCancelamentoNumeroList: [],
      solicitacaoCancelamentoNumeroFields: [
        { key: "ts_cadm", label: "Data" },
        { key: "ds_telf", label: "Máscara" },
        { key: "cd_stat", label: "Status" },
        { key: "fl_envi", label: "Enviado" },
        { key: "detalhes", label: "" }
      ]
    };
  },
  async mounted() {
    try {
      this.block();
      this.solicitacaoCancelamentoNumeroList = await this.getSolicitacaoCancelamentoNumeroList();
    } catch (err) {
      this.$noty.error(err.response ? err.response.data : err.message ? err.message : err);
    } finally {
      this.block(false);
    }
  },
  methods: {
    ...mapActions("block", ["block"]),
    ...mapActions("webmotorsSolicitacaoCancelamentoNumero", [
      "getSolicitacaoCancelamentoNumeroList",
      "updateSolicitacaoCancelamentoNumero"
    ]),
    async update(item, cd_stat) {
      const msg = `Deseja ${
        cd_stat == "ok" ? "concluir" : "rejeitar"
      } a solicitação de cancelamento da máscara "${item.ds_telf}"?`;
      this.$bvModal
        .msgBoxConfirm(msg, {
          centered: true
        })
        .then(async confirm => {
          if (confirm) {
            try {
              this.block();
              const r = await this.updateSolicitacaoCancelamentoNumero({
                ...item,
                cd_stat
              });
              this.$noty.show(r.return_msgm, r.return_code ? "warning" : "success");
              this.solicitacaoCancelamentoNumeroList = await this.getSolicitacaoCancelamentoNumeroList();
            } catch (err) {
              this.$noty.error(err.response ? err.response.data : err.message ? err.message : err);
            } finally {
              this.block(false);
            }
          }
        })
        .catch(err => {
          this.$noty.error(err.response ? err.response.data : err.message ? err.message : err);
        });
    }
  }
};
</script>
