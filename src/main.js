import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/js/dist/tooltip";
import "bootstrap/js/dist/dropdown";
import VueNoty from "vuejs-noty";
import excel from "vue-excel-export";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./veeValidate";
import "./fontAwesome";

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(VueNoty);
Vue.use(excel);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
