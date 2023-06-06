<template>
  <b-container fluid>
    <b-row class="mt-4 mb-3">
      <b-col><h4>Portal - Cadastro de números</h4></b-col>
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

        <b-form-group label="Números a serem inseridos">
          <div class="grid-number">
            <b-form-group
              :invalid-feedback="errors.first('form.telefone ' + (index + 1))"
              :state="validateState('form.telefone ' + (index + 1))"
              v-for="(numero, index) in numeros"
              :key="index"
            >
              <b-form-row>
                <b-col>
                  <the-mask
                    :name="'telefone ' + (index + 1)"
                    class="form-control"
                    type="text"
                    v-model="numeros[index]"
                    v-validate="{ regex: /\d{10,11}/, required: true, phone_number: true }"
                    :mask="['(##) ####-####', '(##) #####-####']"
                  />
                </b-col>

                <b-col v-if="numeros.length > 1" md="auto">
                  <b-button variant="danger" @click="numeros.splice(index, 1)">
                    <b-icon-trash-fill />
                  </b-button>
                </b-col>
              </b-form-row>
            </b-form-group>
          </div>
        </b-form-group>

        <b-form-row>
          <b-col>
            <b-button size="sm" variant="outline-primary" @click="numeros.push('')">
              <b-icon-plus />
              Adicionar Número
            </b-button>
          </b-col>
        </b-form-row>

        <b-form-row>
          <b-col class="text-right">
            <b-button variant="primary" type="submit" size="sm"> Salvar </b-button>
            <b-button type="reset" variant="secondary" size="sm" class="ml-3"> Limpar </b-button>
          </b-col>
        </b-form-row>
      </b-form>
    </b-container>
  </b-container>
</template>

<script>
import { mapActions } from "vuex";
import { BIconPlus, BIconTrashFill } from "bootstrap-vue";

import { TheMask } from "vue-the-mask";

export default {
  components: { TheMask, BIconPlus, BIconTrashFill },
  data() {
    return {
      showForm: false,
      form: {},
      numeros: [""],

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
    ...mapActions("cadastroDeNumeros", ["createNumeros"]),
    ...mapActions("empresa", ["getEmpresaList"]),
    ...mapActions("nivel", ["getNivelList"]),

    async sendForm() {
      this.block();

      try {
        const isValid = await this.$validator.validateAll("form");

        if (isValid) {
          const response = await this.createNumeros({ ...this.form, telef: this.numeros });

          this.$noty.show(response.return_msgm, response.return_code ? "warning" : "success");

          if (!response.return_code) {
            this.$validator.reset();
            this.resetForm();
          }
        }
      } catch (error) {
        this.$noty.error(
          error.response ? error.response.data : error.message ? error.message : error
        );
      }

      this.block(false);
    },
    resetForm() {
      this.$validator.reset();
      this.form = {};
      this.numeros = [""];
    }
  }
};
</script>

<style lang="scss" scoped>
.form-row {
  margin-bottom: 0.5rem;
}

.grid-number {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 3rem;
  row-gap: 0.5rem;
}
</style>
