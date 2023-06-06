<template>
  <b-container fluid>
    <b-row class="mt-4 mb-3">
      <b-col><h4>Portal - Produto Customizado</h4></b-col>
      <b-col class="text-right">
        <b-button variant="primary" size="sm" @click="onNovo">
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
        :fields="produtoCustomizadoFields"
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
              Menu
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
    <b-modal v-model="showForm" id="form-modal" hide-header ok-only>
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
        label="Produto"
        label-for="cd_prod"
        :invalid-feedback="errors.first('form.cd_prod')"
        :state="validateState('form.cd_prod')"
      >
        <b-input-group>
          <b-form-input
            id="cd_prod"
            v-model="form.cd_prod"
            v-validate="'max:50|required'"
            name="cd_prod"
            data-vv-as="cd_prod"
            placeholder="Produto"
            :state="validateState('form.cd_prod')"
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
    <b-modal v-model="showFormMenu" size="xl" id="form-modal-menu" hide-header ok-only>
      <b-row v-for="(n, i) in form" :key="i">
        <b-col cols="3">
          <b-form-group
            label="Ícone"
            :label-for="'cd_icon' + i"
            :invalid-feedback="errors.first('form.cd_icon' + i)"
            :state="validateState('form.cd_icon' + i)"
          >
            <b-input-group>
              <b-form-input
                :id="'cd_icon' + i"
                v-model="form[i].cd_icon"
                v-validate="'max:50|required'"
                :name="'cd_icon' + i"
                data-vv-as="cd_icon"
                placeholder="Ícone"
                :state="validateState('form.cd_icon' + i)"
              />
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col cols="4">
          <b-form-group
            label="Descrição do Menu"
            :label-for="'ds_desc' + i"
            :invalid-feedback="errors.first('form.ds_desc' + i)"
            :state="validateState('form.ds_desc' + i)"
          >
            <b-input-group>
              <b-form-input
                :id="'ds_desc' + i"
                v-model="form[i].ds_desc"
                v-validate="'max:250|required'"
                :name="'ds_desc' + i"
                data-vv-as="ds_desc"
                placeholder="Descrição do Menu"
                :state="validateState('form.ds_desc' + i)"
              />
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col cols="4">
          <b-form-group
            label="URL"
            :label-for="'ds_url' + i"
            :invalid-feedback="errors.first('form.ds_url' + i)"
            :state="validateState('form.ds_url' + i)"
          >
            <b-input-group>
              <b-form-input
                :id="'ds_url' + i"
                v-model="form[i].ds_url"
                v-validate="'max:250|required'"
                :name="'ds_url' + i"
                data-vv-as="ds_url"
                placeholder="URL"
                :state="validateState('form.ds_url' + i)"
              />
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col cols="1">
          <b-form-group v-if="form.length > 1" label="Excluir">
            <b-button variant="danger" title="Excluir" block @click="delMenu(i)">
              -
            </b-button>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="my-3">
        <b-col class="text-right">
          <b-button variant="primary" size="sm" @click="addMenu">
            +
          </b-button>
        </b-col>
      </b-row>
      <template v-slot:modal-footer>
        <div class="w-100 text-right">
          <b-button variant="primary" size="sm" @click="submit">
            Salvar
          </b-button>
          <b-button variant="secondary" size="sm" class="ml-3" @click="showFormMenu = false">
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
      produtoCustomizadoList: [],
      produtoCustomizadoFields: [
        { key: "ds_nivl", label: "Nível" },
        { key: "cd_prod", label: "Produto" },
        { key: "detalhes", label: "" }
      ],
      idProdCustMenu: null,
      showForm: false,
      showFormMenu: false,
      form: {
        id_empr: "",
        id_nivl: ""
      }
    };
  },
  computed: {
    groupedEmpresaList() {
      const groupedList = groupBy(this.produtoCustomizadoList, "id_empr");
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
      return filter(this.selNivelList, n => n.id_empr == this.form.id_empr);
    },
    selNivelList() {
      const defaultNivel = [
        {
          id_nivl: 0,
          id_nivl_acim: 0,
          ds_nivl: "Nenhum",
          ds_nivl_comb: "Nenhum",
          id_empr: this.form.id_empr
        }
      ];
      return defaultNivel.concat(this.nivelList);
    }
  },
  async mounted() {
    try {
      this.block();
      const data = await Promise.all([
        this.getEmpresaList(),
        this.getNivelList(),
        this.getProdutoCustomizadoList()
      ]);
      this.empresaList = data[0];
      this.nivelList = data[1];
      this.produtoCustomizadoList = data[2];
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
    ...mapActions("produtoCustomizado", [
      "getProdutoCustomizadoList",
      "getProdutoCustomizadoMenuById",
      "updateProdutoCustomizadoMenu",
      "insertProdutoCustomizado",
      "deleteProdutoCustomizado"
    ]),
    onNovo() {
      this.idProdCustMenu = null;
      this.form = {
        id_empr: "",
        id_nivl: ""
      };
      this.showForm = true;
    },
    addMenu() {
      this.form.push({ cd_icon: "", ds_desc: "", ds_url: "" });
    },
    delMenu: function(index) {
      this.form.splice(index, 1);
    },
    async submit() {
      try {
        this.block();
        const r = this.idProdCustMenu
          ? await this.updateProdutoCustomizadoMenu({
              formData: this.form,
              id_prod_cust: this.idProdCustMenu
            })
          : await this.insertProdutoCustomizado(this.form);
        this.$noty.show(r.return_msgm, r.return_code ? "warning" : "success");
        this.produtoCustomizadoList = await this.getProdutoCustomizadoList();
        if (this.idProdCustMenu) this.showFormMenu = false;
        else this.showForm = false;
      } catch (err) {
        this.$noty.error(err.response ? err.response.data : err.message ? err.message : err);
      } finally {
        this.block(false);
      }
    },
    async alterar(item) {
      this.idProdCustMenu = item.id_prod_cust;
      const produtoMenu = await this.getProdutoCustomizadoMenuById({
        id_prod_cust: this.idProdCustMenu
      });
      if (produtoMenu && produtoMenu.length) this.form = produtoMenu;
      else this.form = [{ cd_icon: "", ds_desc: "", ds_url: "" }];
      this.showFormMenu = true;
    },
    async excluir(item) {
      this.$bvModal
        .msgBoxConfirm(
          `Deseja excluir o produto customizado do cliente "${item.ds_nivl || "-"}" da empresa "${
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
              const r = await this.deleteProdutoCustomizado(item);
              this.$noty.show(r.return_msgm, r.return_code ? "warning" : "success");
              this.produtoCustomizadoList = await this.getProdutoCustomizadoList();
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
