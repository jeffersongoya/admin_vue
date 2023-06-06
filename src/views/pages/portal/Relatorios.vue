<template>
  <b-container fluid>
    <b-row class="mt-4 mb-3">
      <b-col><h4>Portal - Relatórios</h4></b-col>
    </b-row>
    <b-form data-vv-scope="form" @reset.prevent="resetForm" @submit.prevent="sendForm">
      <b-row class="mt-3">
        <b-col sm="6" md="5" lg="4" xl="3">
          <b-form-group
            label="Tipo de relatório"
            label-for="tipoRelatorio"
            :invalid-feedback="errors.first('form.tipoRelatorio')"
            :state="validateState('form.tipoRelatorio')"
          >
            <b-form-select
              id="tipoRelatorio"
              name="tipoRelatorio"
              v-model="tipoRelatorio"
              v-validate="{ required: true }"
            >
              <option value="" disabled>Selecione...</option>
              <option
                v-for="(tipoRelatorioList, index) in tipoRelatorioList"
                :key="index"
                :value="tipoRelatorioList.tp_relt"
              >
                {{ tipoRelatorioList.ds_relt }}
              </option>
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col sm="6" md="5" lg="4" xl="3">
          <b-form-group
            :invalid-feedback="errors.first('form.dataInic')"
            :state="validateState('form.dataInic')"
            label="Data Inicial"
            label-for="dataInic"
          >
            <b-input
              id="dataInic"
              name="dataInic"
              type="date"
              v-model="dataInic"
              v-validate="{ required: true }"
            >
            </b-input>
          </b-form-group>
        </b-col>
        <b-col sm="6" md="5" lg="4" xl="3">
          <b-form-group
            :invalid-feedback="errors.first('form.dataFinl')"
            :state="validateState('form.dataFinl')"
            label="Data Final"
            label-for="dataFinl"
          >
            <b-input
              id="dataFinl"
              name="dataFinl"
              type="date"
              v-model="dataFinl"
              v-validate="{ required: true }"
            >
            </b-input>
          </b-form-group>
        </b-col>
        <b-col class="text-right spacing">
          <b-button v-if="registros.length" variant="outline-primary" class="mr-3">
            <export-excel :data="registros">
              <font-awesome-icon icon="file-excel" />
              EXPORTAR
            </export-excel>
          </b-button>
          <b-button variant="primary" type="submit"> GERAR </b-button>
        </b-col>
      </b-row>
    </b-form>
    <b-card v-if="showTable" no-body class="mt-3">
      <b-table striped hover :fields="fields" :items="registros"></b-table>
    </b-card>
  </b-container>
</template>

<script>
import { mapActions } from "vuex";
import moment from "moment";

export default {
  name: "Relatorios",
  components: {},
  filters: {
    date(value) {
      return value ? moment(value).format("DD/MM/YYYY") : "";
    }
  },
  data() {
    return {
      registros: [],
      tipoRelatorio: null,
      dataInic: null,
      dataFinl: null,
      showTable: false,
      tipoRelatorioList: [
        {
          tp_relt: "relatorio-flex-tecban-processamento",
          ds_relt: "Flex Tecban Processamento"
        },
        {
          tp_relt: "relatorio-flex-serasa-celulas-receptivas",
          ds_relt: "Flex Serasa Células Receptivas"
        },
        {
          tp_relt: "relatorio-flex-serasa-televendas-ativo-e-receptivo",
          ds_relt: "Flex Serasa Televendas Ativo e Receptivo"
        }
      ]
    };
  },
  computed: {
    fields() {
      if (this.registros.length) {
        return Object.keys(this.registros[0]).map(r => {
          return { key: r, sortable: true };
        });
      } else return [];
    }
  },
  async mounted() {
    if (!this.dataInic || !this.dataFinl) {
      this.dataInic = moment()
        .subtract(7, "day")
        .format("YYYY-MM-DD");
      this.dataFinl = moment().format("YYYY-MM-DD");
    }
  },
  methods: {
    ...mapActions("block", ["block"]),
    ...mapActions("relatorios", [
      "getTecbanRelatorioProcessamento",
      "getSerasaRelatorioCelulasReceptivas",
      "getSerasaRelatorioTelevendasAtivoReceptivo"
    ]),
    async sendForm() {
      try {
        this.block();
        const isValid = await this.$validator.validateAll("form");
        if (isValid) this.registros = await this.getRegistros();
      } catch (err) {
        this.$noty.error(err.response ? err.response.data : err.message ? err.message : err);
      } finally {
        this.block(false);
      }
    },
    async getRegistros() {
      const tp = this.tipoRelatorio || null;
      let registros = [];

      if (tp == "relatorio-flex-tecban-processamento") {
        this.showTable = true;
        registros = await this.getTecbanRelatorioProcessamento({
          dataInic: this.dataInic,
          dataFinl: this.dataFinl
        });
        for (let i = 0; i < registros.length; i++) {
          const { quantidadeImportados, quantidadeProcessados } = registros[i];
          let porcentagemProcessados = 0;
          if (quantidadeImportados) {
            porcentagemProcessados = (quantidadeProcessados / quantidadeImportados) * 100;
            registros[i].porcentagemProcessada = porcentagemProcessados.toFixed(2) + "%";
          } else registros[i].porcentagemProcessada = "-";
        }
      } else if (tp == "relatorio-flex-serasa-celulas-receptivas") {
        this.showTable = true;
        registros = await this.getSerasaRelatorioCelulasReceptivas({
          dataInic: this.dataInic,
          dataFinl: this.dataFinl
        });
      } else if (tp == "relatorio-flex-serasa-televendas-ativo-e-receptivo") {
        this.showTable = true;
        registros = await this.getSerasaRelatorioTelevendasAtivoReceptivo({
          dataInic: this.dataInic,
          dataFinl: this.dataFinl
        });
      }

      return registros;
    }
  }
};
</script>
<style scoped>
.spacing {
  margin-top: 32px;
}
</style>
