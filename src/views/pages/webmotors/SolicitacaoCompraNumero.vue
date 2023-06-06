<template>
  <b-container fluid>
    <h4>Webmotors - Solicitação de compra de número</h4>
    <b-card class="mb-3" body-class="p-0">
      <b-table
        striped
        hover
        :items="solicitacaoCompraNumeroList"
        :fields="solicitacaoCompraNumeroFields"
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
          <div
            v-if="row.item.cd_stat == 'ok' && row.item.telf_list.length"
            class="w-100 text-right"
          >
            <b-button
              variant="secondary"
              size="sm"
              :style="{ width: '80px' }"
              @click="showNumerosSolicitacaoCompra(row.item)"
            >
              Números
            </b-button>
          </div>
        </template>
      </b-table>
    </b-card>
    <b-modal
      v-model="showModalSolicitacaoCompraNumero"
      title="Concluir solicitação de compra de número"
      @hidden="resetModalSolicitacaoCompraNumero"
      @ok="concluiSolicitacaoCompraNumero"
    >
      <form ref="form" @submit.stop.prevent="concluiSolicitacaoCompraNumero">
        <b-form-group
          label="Números"
          label-for="numeros-solicitacao-compra"
          invalid-feedback="Name is required"
          :state="numerosSolicitacaoCompraState"
        >
          <b-form-textarea
            id="numeros-solicitacao-compra"
            v-model="numerosSolicitacaoCompra"
            :state="numerosSolicitacaoCompraState"
            required
          ></b-form-textarea>
        </b-form-group>
      </form>
    </b-modal>
  </b-container>
</template>

<script>
import { mapActions } from "vuex";
export default {
  computed: {
    showModalSolicitacaoCompraNumero() {
      return this.solicitacaoCompraNumero?.id_soli_comp_telf > 0;
    }
  },
  data() {
    return {
      solicitacaoCompraNumeroList: [],
      solicitacaoCompraNumeroFields: [
        { key: "ts_cadm", label: "Data" },
        { key: "ds_cidd", label: "Cidade" },
        { key: "cd_ddd", label: "DDD" },
        { key: "qt_telf", label: "Qnt" },
        { key: "cd_stat", label: "Status" },
        { key: "fl_envi", label: "Enviado" },
        { key: "detalhes", label: "" }
      ],
      solicitacaoCompraNumero: null,
      numerosSolicitacaoCompra: null,
      numerosSolicitacaoCompraState: null
    };
  },
  async mounted() {
    try {
      this.block();
      this.solicitacaoCompraNumeroList = await this.getSolicitacaoCompraNumeroList();
    } catch (err) {
      this.$noty.error(err.response ? err.response.data : err.message ? err.message : err);
    } finally {
      this.block(false);
    }
  },
  methods: {
    ...mapActions("block", ["block"]),
    ...mapActions("webmotorsSolicitacaoCompraNumero", [
      "getSolicitacaoCompraNumeroList",
      "updateSolicitacaoCompraNumero"
    ]),
    async update(item, cd_stat) {
      const msg = `Deseja ${cd_stat == "ok" ? "concluir" : "rejeitar"} a solicitação de "${
        item.qt_telf
      }" número(s) da cidade "(${item.cd_ddd}) ${item.ds_cidd}"?`;
      this.$bvModal
        .msgBoxConfirm(msg, {
          centered: true
        })
        .then(async confirm => {
          if (confirm) {
            if (cd_stat == "ok") {
              this.solicitacaoCompraNumero = item;
            } else {
              try {
                this.block();
                const r = await this.updateSolicitacaoCompraNumero({
                  ...item,
                  cd_stat
                });
                this.$noty.show(r.return_msgm, r.return_code ? "warning" : "success");
                this.solicitacaoCompraNumeroList = await this.getSolicitacaoCompraNumeroList();
              } catch (err) {
                this.$noty.error(
                  err.response ? err.response.data : err.message ? err.message : err
                );
              } finally {
                this.block(false);
              }
            }
          }
        })
        .catch(err => {
          this.$noty.error(err.response ? err.response.data : err.message ? err.message : err);
        });
    },
    resetModalSolicitacaoCompraNumero() {
      this.solicitacaoCompraNumero = null;
      this.numerosSolicitacaoCompra = null;
      this.numerosSolicitacaoCompraState = null;
    },
    async concluiSolicitacaoCompraNumero() {
      try {
        this.block();
        const ds_telf_list =
          this.numerosSolicitacaoCompra?.split(/\r\n|\n\r|\n|\r/).map(n => {
            return parseInt(n.replace(/\D/g, ""));
          }) || [];
        const r = await this.updateSolicitacaoCompraNumero({
          ...this.solicitacaoCompraNumero,
          cd_stat: "ok",
          ds_telf_list
        });
        this.$noty.show(r.return_msgm, r.return_code ? "warning" : "success");
        this.solicitacaoCompraNumeroList = await this.getSolicitacaoCompraNumeroList();
      } catch (err) {
        this.$noty.error(err.response ? err.response.data : err.message ? err.message : err);
      } finally {
        this.block(false);
      }
    },
    showNumerosSolicitacaoCompra(item) {
      const h = this.$createElement;
      const message = item?.telf_list?.map(telf => h("p", { class: ["m-0"] }, telf));
      this.$bvModal.msgBoxOk([message], {
        centered: true
      });
    }
  }
};
</script>
