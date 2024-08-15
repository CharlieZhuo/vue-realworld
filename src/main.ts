import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import { updateAPIClientFromUserStore } from "./utils/updateAPIClientFromUserStore";
import { BrowserUserManager } from "./plugins/BrowserUserManager";

updateAPIClientFromUserStore();

const app = createApp(App);
app.use(BrowserUserManager.UserPlugin).use(router);
app.mount("#app");
