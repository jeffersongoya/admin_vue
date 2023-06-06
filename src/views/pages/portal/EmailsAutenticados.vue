<template>
  <b-container fluid>
    <b-row class="mt-4 mb-3">
      <b-col><h4>Portal - E-mails Autenticados</h4></b-col>
      <b-col class="text-right">
        <b-button variant="primary" size="sm" @click="showForm = true">
          Incluir
        </b-button>
      </b-col>
    </b-row>

    <b-card v-for="(empresa, i) in groupedEmpresaList" :key="i" class="mb-3" body-class="p-0">
      <h5 class="m-3">{{ empresa.nm_empr }}</h5>
      <b-table
        striped
        hover
        :items="empresa.items"
        :fields="emailsAutenticadosFields"
        sort-by="ds_nivl"
        class="mb-0"
      >
        <template v-slot:cell(ds_nivl)="row">
          {{ row.item.ds_nivl || "-" }}
        </template>
        <template v-slot:cell(detalhes)="row">
          <div class="w-100 text-right">
            <b-button
              variant="warning"
              size="sm"
              :style="{ width: '80px' }"
              @click="alterar(row.item)"
            >
              Editar
            </b-button>
            <b-button
              variant="danger"
              size="sm"
              :style="{ width: '70px' }"
              class="ml-3"
              @click="excluir(row.item)"
            >
              Excluir
            </b-button>
          </div>
        </template>
      </b-table>
    </b-card>

    <!-- Detalhes modal -->
    <b-modal v-model="showForm" id="form-modal" hide-header ok-only @hide="resetFormModal">
      <b-form-group
        label="Empresa"
        label-for="id_empr"
        :invalid-feedback="errors.first('form.id_empr')"
        :state="validateState('form.id_empr')"
      >
        <b-form-select
          id="id_empr"
          name="id_empr"
          v-model="form.id_empr"
          v-validate="{ required: true }"
          data-vv-as="empresa"
          :disabled="form.id_empr_nivl_mail"
          :state="validateState('form.id_empr')"
        >
          <option value="" disabled> Selecione... </option>
          <option v-for="(empresa, index) in empresaList" :key="index" :value="empresa.id_empr">
            {{ empresa.nm_empr }}
          </option>
        </b-form-select>
      </b-form-group>
      <b-form-group
        label="Nível"
        label-for="id_nivl"
        :invalid-feedback="errors.first('form.id_nivl')"
        :state="validateState('form.id_nivl')"
      >
        <b-form-select
          id="id_nivl"
          name="id_nivl"
          v-model="form.id_nivl"
          v-validate="{ required: true }"
          data-vv-as="nível"
          :disabled="!form.id_empr && !form.id_empr_nivl_mail"
          :state="validateState('form.id_nivl')"
        >
          <option value="" disabled> Selecione... </option>
          <option v-for="(nivel, index) in filteredNivelList" :key="index" :value="nivel.id_nivl">
            {{ nivel.ds_nivl_comb }}
          </option>
        </b-form-select>
      </b-form-group>
      <b-form-group
        label="E-mail"
        label-for="ds_mail"
        :invalid-feedback="errors.first('form.ds_mail')"
        :state="validateState('form.ds_mail')"
      >
        <b-input-group>
          <b-form-input
            id="ds_mail"
            v-model="form.ds_mail"
            v-validate="'max:250|email|required'"
            name="ds_mail"
            data-vv-as="ds_mail"
            placeholder="E-mail"
            :state="validateState('form.ds_mail')"
            trim
          />
        </b-input-group>
      </b-form-group>
      <b-form-group
        label="Token"
        label-for="ds_acce_toke"
        :invalid-feedback="errors.first('form.ds_acce_toke')"
        :state="validateState('form.ds_acce_toke')"
      >
        <b-input-group>
          <b-form-input
            id="ds_acce_toke"
            v-model="form.ds_acce_toke"
            v-validate="'max:250|required'"
            name="ds_acce_toke"
            data-vv-as="ds_acce_toke"
            placeholder="Token"
            :state="validateState('form.ds_acce_toke')"
            trim
          />
        </b-input-group>
      </b-form-group>
      <b-form-group
        label="ID"
        label-for="ds_acco_id"
        :invalid-feedback="errors.first('form.ds_acco_id')"
        :state="validateState('form.ds_acco_id')"
      >
        <b-input-group>
          <b-form-input
            id="ds_acco_id"
            v-model="form.ds_acco_id"
            v-validate="'max:250|required'"
            name="ds_acco_id"
            data-vv-as="ds_acco_id"
            placeholder="ID da Conta"
            :state="validateState('form.ds_acco_id')"
            trim
          />
        </b-input-group>
      </b-form-group>
      <template v-slot:modal-footer>
        <div class="w-100 text-right">
          <b-button variant="primary" size="sm" @click="submit">
            Salvar
          </b-button>
          <b-button variant="secondary" size="sm" class="ml-3" @click="showForm = false">
            Fechar
          </b-button>
        </div>
      </template>
    </b-modal>
  </b-container>
</template>

<script>
import { mapActions } from "vuex";
import groupBy from "lodash/groupBy";
import map from "lodash/map";
import filter from "lodash/filter";
import keys from "lodash/keys";
export default {
  data() {
    return {
      empresaList: [],
      nivelList: [],
      emailsAutenticadosList: [],
      emailsAutenticadosFields: [
        { key: "ds_nivl", label: "Nível" },
        { key: "ds_mail", label: "E-mail" },
        { key: "ds_acce_toke", label: "Token" },
        { key: "ds_acco_id", label: "ID" },
        { key: "detalhes", label: "" }
      ],
      showForm: false,
      form: {
        id_empr: "",
        id_nivl: ""
      }
    };
  },
  computed: {
    groupedEmpresaList() {
      const groupedList = groupBy(this.emailsAutenticadosList, "id_empr");
      return map(keys(groupedList), id_empr => {
        const items = groupedList[id_empr];
        const { nm_empr } = items[0];
        return {
          id_empr,
          nm_empr,
          items
        };
      });
    },
    filteredNivelList() {
      return filter(this.nivelList, n => n.id_empr == this.form.id_empr);
    }
  },
  async mounted() {
    try {
      this.block();
      const data = await Promise.all([
        this.getEmpresaList(),
        this.getNivelList(),
        this.getEmailsAutenticadosList()
      ]);
      this.empresaList = data[0];
      this.nivelList = data[1];
      this.emailsAutenticadosList = data[2];
    } catch (err) {
      this.$noty.error(err.response ? err.response.data : err.message ? err.message : err);
    } finally {
      this.block(false);
    }
  },
  methods: {
    ...mapActions("block", ["block"]),
    ...mapActions("empresa", ["getEmpresaList"]),
    ...mapActions("nivel", ["getNivelList"]),
    ...mapActions("emailsAutenticados", [
      "getEmailsAutenticadosList",
      "insertEmailsAutenticados",
      "updateEmailsAutenticados",
      "deleteEmailsAutenticados"
    ]),
    async submit() {
      try {
        this.block();
        const r = this.form.id_empr_nivl_mail
          ? await this.updateEmailsAutenticados(this.form)
          : await this.insertEmailsAutenticados(this.form);
        this.$noty.show(r.return_msgm, r.return_code ? "warning" : "success");
        this.emailsAutenticadosList = await this.getEmailsAutenticadosList();
        this.showForm = false;
      } catch (err) {
        this.$noty.error(err.response ? err.response.data : err.message ? err.message : err);
      } finally {
        this.block(false);
      }
    },
    async alterar(item) {
      this.form = { ...item };
      this.showForm = true;
    },
    async excluir(item) {
      this.$bvModal
        .msgBoxConfirm(
          `Deseja excluir o e-mail autenticado do cliente "${item.ds_nivl || "-"}" da empresa "${
            item.nm_empr
          }"?`,
          {
            centered: true
          }
        )
        .then(async confirm => {
          if (confirm) {
            try {
              this.block();
              const r = await this.deleteEmailsAutenticados(item);
              this.$noty.show(r.return_msgm, r.return_code ? "warning" : "success");
              this.emailsAutenticadosList = await this.getEmailsAutenticadosList();
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
    },
    async resetFormModal() {
      try {
        this.block();
        this.form = {
          id_empr: "",
          id_nivl: ""
        };
      } catch (err) {
        this.$noty.error(err.response ? err.response.data : err.message ? err.message : err);
      } finally {
        this.block(false);
      }
    }
  }
};
</script>
