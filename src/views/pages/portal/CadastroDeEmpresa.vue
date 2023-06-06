<template>
  <b-container fluid>
    <b-row class="mt-4 mb-3">
      <b-col><h4>Portal - Cadastro de Empresas</h4></b-col>
      <b-col class="text-right">
        <b-button variant="primary" size="sm" @click="showForm = true">
          Incluir
        </b-button>
      </b-col>
    </b-row>

    <b-table striped hover :items="listEmpresas" :fields="empresasCadastradasFilds">
      <template v-slot:cell(ts_cadm)="row">
        {{ row.item.ts_cadm || "-" }}
      </template>

      <template v-slot:cell(produtos)="row">
        {{ row.item.produtos.join(", ") }}
      </template>

      <template v-slot:cell(acoes)="row">
        <div class="w-100 text-right">
          <b-button
            variant="warning"
            size="sm"
            :style="{ width: '80px' }"
            @click="editEmpresa(row.item.id_empr)"
          >
            Editar
          </b-button>
        </div>
      </template>
    </b-table>

    <b-modal v-model="showForm" hide-header ok-only @hide="resetFormModal">
      <b-form data-vv-scope="form">
        <b-form-group
          :invalid-feedback="errors.first('form.id')"
          :state="validateState('form.id')"
          :disabled="empresaAtual.id_empr != undefined"
          v-if="empresaAtual.id_empr != undefined"
          label="ID da empresa"
        >
          <b-form-input name="id" v-validate="{ numeric: true }" v-model="form.id_empr">
          </b-form-input>
        </b-form-group>

        <b-form-group
          :invalid-feedback="errors.first('form.nome')"
          :state="validateState('form.nome')"
          label="Nome da empresa"
        >
          <b-form-input
            name="nome"
            v-validate="{ required: true, max: 100 }"
            v-model="form.nm_empr"
          >
          </b-form-input>
        </b-form-group>

        <b-form-group
          :state="validateState('form.produtos')"
          :invalid-feedback="errors.first('form.produtos')"
          label="Produtos da Empresa"
        >
          <b-form-checkbox-group
            name="produtos"
            v-validate="{ required: true }"
            v-model="form.produtos"
            :options="checkBoxOptions"
            stacked
          >
          </b-form-checkbox-group>
        </b-form-group>
      </b-form>

      <div class="texto-reduzido">
        <b-form-row>
          <b-col>
            Usuário que cadastrou
          </b-col>
          <b-col>
            Usuário que atualizou
          </b-col>
        </b-form-row>

        <b-form-row>
          <b-col>
            Nome:
            <strong>{{ empresaAtual.cadastro ? empresaAtual.cadastro.ds_nome : "-" }}</strong>
          </b-col>

          <b-col>
            Nome:
            <strong>{{ empresaAtual.manutencao ? empresaAtual.manutencao.ds_nome : "-" }}</strong>
          </b-col>
        </b-form-row>

        <b-form-row>
          <b-col>
            E-mail:
            <strong>{{ empresaAtual.cadastro ? empresaAtual.cadastro.ds_mail : "-" }}</strong>
          </b-col>

          <b-col>
            E-mail:
            <strong>{{ empresaAtual.manutencao ? empresaAtual.manutencao.ds_mail : "-" }}</strong>
          </b-col>
        </b-form-row>
      </div>

      <template v-slot:modal-footer>
        <div class="w-100 text-right">
          <b-button variant="primary" size="sm" @click="sendForm">
            Salvar
          </b-button>
          <b-button variant="secondary" size="sm" class="ml-3" @click="resetFormModal">
            Fechar
          </b-button>
        </div>
      </template>
    </b-modal>
  </b-container>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data: function() {
    return {
      showForm: false,
      listEmpresas: [],
      empresasCadastradasFilds: [
        { key: "id_empr", label: "ID empresa" },
        { key: "nm_empr", label: "Nome da empresa" },
        { key: "ts_cadm", label: "Data de cadastro" },
        { key: "produtos", label: "Produtos cadastrados" },
        { key: "acoes", label: "Ações" }
      ],
      checkBoxOptions: [
        { text: "Calltracking", value: "calltracking" },
        { text: "PABX virtual", value: "PABXVirtual" },
        { text: "Email", value: "emailTracking" },
        { text: "Whatsapp", value: "whatsApp" },
        { text: "Comportamento", value: "intencao" }
      ],
      form: {
        produtos: []
      },
      empresaAtual: {
        produtos: []
      }
    };
  },
  async mounted() {
    this.block();

    this.listEmpresas = await this.getListEmpresa();

    this.block(false);
  },
  computed: {
    hasCalltracking() {
      return (
        this.form.produtos.includes("calltracking") ||
        this.empresaAtual.produtos.includes("calltracking")
      );
    },
    hasPABXVirtual() {
      return (
        this.form.produtos.includes("PABXVirtual") ||
        this.empresaAtual.produtos.includes("PABXVirtual")
      );
    },
    hasEmailTracking() {
      return (
        this.form.produtos.includes("emailTracking") ||
        this.empresaAtual.produtos.includes("emailTracking")
      );
    },
    hasWhatsApp() {
      return (
        this.form.produtos.includes("whatsApp") || this.empresaAtual.produtos.includes("whatsApp")
      );
    },
    hasIntencao() {
      return (
        this.form.produtos.includes("intencao") || this.empresaAtual.produtos.includes("intencao")
      );
    }
  },
  methods: {
    ...mapActions("block", ["block"]),
    ...mapActions("cadastroDeEmpresa", [
      "getListEmpresa",
      "getEmpresaById",
      "createEmpresa",
      "updateEmpresa"
    ]),

    async editEmpresa(id_empr) {
      this.block();
      this.empresaAtual = await this.getEmpresaById({ id_empr });

      this.form = { ...this.empresaAtual };

      this.checkBoxOptions = [
        { text: "Calltracking", value: "calltracking", disabled: this.hasCalltracking },
        { text: "PABX virtual", value: "PABXVirtual", disabled: this.hasPABXVirtual },
        { text: "Email", value: "emailTracking", disabled: this.hasEmailTracking },
        { text: "Whatsapp", value: "whatsApp", disabled: this.hasWhatsApp },
        { text: "Comportamento", value: "intencao", disabled: this.hasIntencao }
      ];

      this.showForm = true;

      this.block(false);
    },

    async sendForm() {
      this.block();

      try {
        const isValid = await this.$validator.validateAll("form");

        if (isValid) {
          let response;

          if (!this.empresaAtual.id_empr) {
            response = await this.createEmpresa(this.form);
          } else {
            response = await this.updateEmpresa({
              ...this.form,
              produtos: this.form.produtos.filter(e => !this.empresaAtual.produtos.includes(e))
            });
          }

          this.$noty.show(response.return_msgm, response.return_code ? "warning" : "success");

          if (!response.return_code) {
            this.$validator.reset();
            this.resetFormModal();
          }

          this.listEmpresas = await this.getListEmpresa();
        }
      } catch (error) {
        this.$noty.error(
          error.response ? error.response.data : error.message ? error.message : error
        );
      }

      this.block(false);
    },

    resetFormModal() {
      this.empresaAtual = { produtos: [] };
      this.form = { produtos: [] };

      this.checkBoxOptions = [
        { text: "Calltracking", value: "calltracking" },
        { text: "PABX virtual", value: "PABXVirtual" },
        { text: "Email", value: "emailTracking" },
        { text: "Whatsapp", value: "whatsApp" },
        { text: "Comportamento", value: "intencao" }
      ];

      this.showForm = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.texto-reduzido {
  font-size: 70%;
}
</style>
