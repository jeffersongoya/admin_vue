<template>
  <b-container fluid>
    <b-row class="mt-4 mb-3">
      <b-col><h4>Portal - Reprocessamento Comportamento</h4></b-col>
    </b-row>

    <b-container fluid="sm">
      <b-form data-vv-scope="form" @reset.prevent="resetForm" @submit.prevent="sendForm">
        <b-form-group
          label-for="empresa"
          :invalid-feedback="errors.first('form.empresa')"
          :state="validateState('form.empresa')"
          label="Empresa"
        >
          <b-form-select
            id="empresa"
            name="empresa"
            v-model="form.id_empr"
            v-validate="{ required: true }"
          >
            <option value="" disabled>Selecione...</option>
            <option v-for="(empresa, index) in empresaList" :key="index" :value="empresa.id_empr">
              {{ empresa.nm_empr }}
            </option>
          </b-form-select>
        </b-form-group>

        <b-form-group
          :invalid-feedback="errors.first('form.nível')"
          :state="validateState('form.nível')"
          label="Nível"
          label-for="nível"
        >
          <b-form-select
            id="nível"
            name="nível"
            v-model="form.id_nivl"
            v-validate="{ required: true }"
          >
            <option :value="0">Todos</option>
            <option v-for="(nivel, index) in filteredNivelList" :key="index" :value="nivel.id_nivl">
              {{ nivel.ds_nivl_comb }}
            </option>
          </b-form-select>
        </b-form-group>

        <b-row>
          <b-col>
            <b-form-group
              :invalid-feedback="errors.first('form.dt_inic')"
              :state="validateState('form.dt_inic')"
              label="Data/Hora Inicial"
              label-for="dt_inic"
            >
              <b-input
                id="dt_inic"
                name="dt_inic"
                type="datetime-local"
                v-model="form.dt_inic"
                v-validate="{ required: true }"
              >
              </b-input>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group
              :invalid-feedback="errors.first('form.dt_finl')"
              :state="validateState('form.dt_finl')"
              label="Data/Hora Final"
              label-for="dt_finl"
            >
              <b-input
                id="dt_finl"
                name="dt_finl"
                type="datetime-local"
                v-model="form.dt_finl"
                v-validate="{ required: true }"
              >
              </b-input>
            </b-form-group>
          </b-col>
        </b-row>

        <b-form-row class="mt-3">
          <b-col class="text-right">
            <b-button variant="primary" type="submit" size="sm"> Reprocessar </b-button>
            <b-button type="reset" variant="secondary" size="sm" class="ml-3"> Limpar </b-button>
          </b-col>
        </b-form-row>
      </b-form>
    </b-container>
  </b-container>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      showForm: false,
      form: {},
      empresaList: [],
      nivelList: []
    };
  },
  computed: {
    filteredNivelList() {
      return this.nivelList.filter(e => e.id_empr == this.form.id_empr);
    }
  },
  async mounted() {
    this.block();

    this.empresaList = await this.getEmpresaList();
    this.nivelList = await this.getNivelList();

    this.block(false);
  },

  methods: {
    ...mapActions("block", ["block"]),
    ...mapActions("reprocessamentoComportamento", [
      "getQuantidadeRegistros",
      "reprocessarComportamentos"
    ]),
    ...mapActions("empresa", ["getEmpresaList"]),
    ...mapActions("nivel", ["getNivelList"]),

    async sendForm() {
      const isValid = await this.$validator.validateAll("form");
      if (isValid) {
        this.block();
        let quantidadeRegistros = { qtd: 0 };
        try {
          quantidadeRegistros = await this.getQuantidadeRegistros({ ...this.form });
        } catch (err) {
          this.$noty.error(err.response ? err.response.data : err.message ? err.message : err);
        }
        this.block(false);
        this.$bvModal
          .msgBoxConfirm(`Serão alterados ${quantidadeRegistros.qtd} registros.`)
          .then(async confirm => {
            if (confirm) {
              this.block();
              try {
                let r = await this.reprocessarComportamentos({
                  ...this.form
                });

                this.$noty.show(r.return_msgm, r.return_code ? "warning" : "success");

                if (!r.return_code) {
                  this.$validator.reset();
                  this.resetForm();
                }
              } catch (err) {
                this.$noty.error(
                  err.response ? err.response.data : err.message ? err.message : err
                );
              }
              this.block(false);
            }
          });
      }
    },
    resetForm() {
      this.$validator.reset();
      this.form = {};
    }
  }
};
</script>
