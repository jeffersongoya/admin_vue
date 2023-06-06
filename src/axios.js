import axios from "axios";
import store from "./store";
import router from "./router";

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 30 * 1000
});

instance.interceptors.request.use(
  config => {
    config.headers.authorization = "Bearer " + store.state.auth.token;
    config.headers["accept-language"] = "pt-br";
    return config;
  },
  error => Promise.reject(error)
);

instance.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    if (error.response && error.response.status === 401) {
      router.push("/login");
    } else if ((error.response && error.response.status === 408) || error.code === "ECONNABORTED") {
      return Promise.reject("erro.ajaxTimeout");
    } else {
      return Promise.reject(error);
    }
  }
);

export default instance;
