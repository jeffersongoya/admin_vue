import Vue from "vue";
import VeeValidate from "vee-validate";
import pt_BR from "vee-validate/dist/locale/pt_BR";
import es from "vee-validate/dist/locale/es";
import get from "lodash/get";
import PhoneNumber from "awesome-phonenumber";

Vue.use(VeeValidate, {
  fieldsBagName: "formFields" // fix issue with b-table
});

Vue.mixin({
  methods: {
    validateState(ref) {
      const field = get(this.formFields, "$" + ref);
      return field && (field.validated || field.dirty) ? field.valid : null;
    }
  }
});

VeeValidate.Validator.extend("verify_password", {
  validate(value) {
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
    return strongRegex.test(value);
  }
});

VeeValidate.Validator.extend("phone_number", {
  validate(value) {
    return new Promise(resolve => {
      const phone = new PhoneNumber(value, "BR");
      resolve({ valid: phone.isValid() });
    });
  }
});

const veeValidateLocales = {
  pt_BR: {
    verify_password: field =>
      `O campo ${field} deve conter pelo menos: 1 letra maiúscula, 1 letra minúscula, 1 número e um caractere especial ( ! @ # $ % ^ & * ).`,
    phone_number: field => `O campo ${field} não é um telefone válido.`
  },
  es: {
    verify_password: field =>
      `El campo ${field} debe contener al menos: 1 letra mayúscula, 1 letra minúscula, 1 número y un carácter especial ( ! @ # $ % ^ & * ).`,
    phone_number: field => `El campo ${field} no es un teléfono válido.`
  }
};

pt_BR.messages = { ...pt_BR.messages, ...veeValidateLocales.pt_BR };
es.messages = { ...es.messages, ...veeValidateLocales.es };

VeeValidate.Validator.localize("pt_BR", pt_BR);

export { VeeValidate, pt_BR, es };
