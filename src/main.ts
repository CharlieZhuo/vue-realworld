import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import { UserManager } from "./plugins/user";
import BrowserKVStore from "./stores/BrowserKVStore";
import { updateAPIClientFromUserStore } from "./utils/updateAPIClientFromUserStore";

export const userManager = new UserManager(new BrowserKVStore("user"));
updateAPIClientFromUserStore();

const app = createApp(App);
app.use(userManager.UserPlugin).use(router);
app.mount("#app");
