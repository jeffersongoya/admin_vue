<template>
  <b-container fluid>
    <b-row class="mt-4 mb-3">
      <b-col><h4>CX - Clientes</h4></b-col>
      <b-col class="text-right">
        <b-button variant="primary" size="sm" @click="incluir"> Incluir </b-button>
      </b-col>
    </b-row>

    <b-card v-for="(empresa, i) in groupedEmpresaList" :key="i" class="mb-3" body-class="p-0">
      <h5 class="m-3">{{ empresa.nm_empr }}</h5>
      <b-table
        striped
        hover
        :items="empresa.items"
        :fields="clientesFields"
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
          :disabled="edit"
          :state="validateState('form.id_empr')"
        >
          <option value="" disabled>Selecione...</option>
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
          :disabled="!form.id_empr || edit"
          :state="validateState('form.id_nivl')"
        >
          <option :value="0">Todos</option>
          <option v-for="(nivel, index) in filteredNivelList" :key="index" :value="nivel.id_nivl">
            {{ nivel.ds_nivl_comb }}
          </option>
        </b-form-select>
      </b-form-group>
      <b-form-group
        label="Código do cliente (CX)"
        label-for="ds_exte_id_clie"
        :invalid-feedback="errors.first('form.ds_exte_id_clie')"
        :state="validateState('form.ds_exte_id_clie')"
      >
        <b-input-group>
          <b-form-input
            id="ds_exte_id_clie"
            v-model="form.ds_exte_id_clie"
            v-validate="'max:250|required'"
            name="ds_exte_id_clie"
            data-vv-as="ds_exte_id_clie"
            placeholder="Código"
            :state="validateState('form.ds_exte_id_clie')"
            trim
          />
        </b-input-group>
      </b-form-group>
      <template v-slot:modal-footer>
        <div class="w-100 text-right">
          <b-button variant="primary" size="sm" @click="submit"> Salvar </b-button>
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
      clientesList: [],
      clientesFields: [
        { key: "ds_nivl", label: "Nível" },
        { key: "ds_exte_id_clie", label: "Código do cliente" },
        { key: "detalhes", label: "" }
      ],
      showForm: false,
      form: {
        id_empr: "",
        id_nivl: 0
      },
      edit: false
    };
  },
  computed: {
    groupedEmpresaList() {
      const groupedList = groupBy(this.clientesList, "id_empr");
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
        this.getCxClientesList()
      ]);
      this.empresaList = data[0];
      this.nivelList = data[1];
      this.clientesList = data[2];
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
    ...mapActions("cxClientes", [
      "getCxClientesList",
      "insertCxClientes",
      "updateCxClientes",
      "deleteCxClientes"
    ]),
    async submit() {
      try {
        this.block();
        const r = this.edit
          ? await this.updateCxClientes(this.form)
          : await this.insertCxClientes(this.form);
        this.$noty.show(r.return_msgm, r.return_code ? "warning" : "success");
        this.clientesList = await this.getCxClientesList();
        this.showForm = false;
      } catch (err) {
        this.$noty.error(err.response ? err.response.data : err.message ? err.message : err);
      } finally {
        this.block(false);
      }
    },
    async incluir() {
      this.edit = false;
      this.showForm = true;
    },
    async alterar(item) {
      this.edit = true;
      this.form = { ...item };
      this.showForm = true;
    },
    async excluir(item) {
      this.$bvModal
        .msgBoxConfirm(
          `Deseja excluir o cliente "${item.ds_nivl || "-"}" da empresa "${item.nm_empr}"?`,
          {
            centered: true
          }
        )
        .then(async confirm => {
          if (confirm) {
            try {
              this.block();
              const r = await this.deleteCxClientes(item);
              this.$noty.show(r.return_msgm, r.return_code ? "warning" : "success");
              this.clientesList = await this.getCxClientesList();
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
          id_nivl: 0
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
