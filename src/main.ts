import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import { userPlugin } from "./plugins/user";
import { updateAPIClientFromUserStore } from "./utils/updateAPIClientFromUserStore";

const app = createApp(App).use(userPlugin).use(router);

updateAPIClientFromUserStore();

app.mount("#app");
