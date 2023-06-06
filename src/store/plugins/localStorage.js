const JWT = "jwt";
const LOCALIZE = "localize";

const init = localStorage[JWT];

const plugin = store => {
  store.subscribe(mutation => {
    switch (mutation.type) {
      case "auth/setToken":
        localStorage[JWT] = mutation.payload;
        break;
      case "auth/resetToken":
        localStorage.removeItem(JWT);
        break;
      case "localization/localize":
        localStorage[LOCALIZE] = mutation.payload;
        break;
    }
  });
};

export default plugin;
export { init };
