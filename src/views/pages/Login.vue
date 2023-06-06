<template>
  <b-container>
    <b-row>
      <b-col md="5" class="mx-auto">
        <form data-vv-scope="login" @submit.prevent="validateBeforeSubmit('login')">
          <b-form-group
            label="E-mail"
            label-for="ds_mail"
            :invalid-feedback="errors.first('login.ds_mail')"
            :state="validateState('login.ds_mail')"
          >
            <b-form-input
              id="ds_mail"
              v-model="login.ds_mail"
              v-validate="'required|email'"
              name="ds_mail"
              placeholder="E-mail"
              data-vv-as="E-mail"
              :state="validateState('login.ds_mail')"
              trim
            />
          </b-form-group>

          <b-form-group
            label="Senha"
            label-for="ds_senh"
            :invalid-feedback="errors.first('login.ds_senh')"
            :state="validateState('login.ds_senh')"
          >
            <b-form-input
              id="ds_senh"
              v-model="login.ds_senh"
              v-validate="{
                required: true,
                min: 8,
                verify_password: true
              }"
              type="password"
              name="ds_senh"
              placeholder="Senha"
              data-vv-as="Senha"
              :state="validateState('login.ds_senh')"
              trim
            />
          </b-form-group>
          <b-button type="submit">
            Entrar
          </b-button>
        </form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapMutations, mapActions } from "vuex";

export default {
  data() {
    return {
      login: {
        ds_mail: "",
        ds_senh: ""
      }
    };
  },
  mounted() {
    this.resetAuthState();
  },
  methods: {
    ...mapActions("block", ["block"]),
    ...mapMutations("auth", {
      resetAuthState: "resetState"
    }),
    ...mapActions("auth", {
      setLogin: "login"
    }),
    validateBeforeSubmit(scope) {
      this.$validator.validateAll(scope).then(result => {
        if (result) this.submitLogin();
      });
    },
    async submitLogin() {
      try {
        this.block();
        this.resetAuthState();
        await this.setLogin({ ...this.$data.login });
        this.$router.push("/");
      } catch (err) {
        this.$noty.error(err.response ? err.response.data : err.message ? err.message : err);
      } finally {
        this.block(false);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  padding-top: 4.2rem;
  padding-bottom: 4.2rem;
}
</style>
