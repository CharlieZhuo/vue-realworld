import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import { createUserPlugin, browserUserStore } from "./plugins/user";
import { updateAPIClientFromUserStore } from "./utils/updateAPIClientFromUserStore";

const app = createApp(App).use(createUserPlugin(browserUserStore)).use(router);

updateAPIClientFromUserStore();

app.mount("#app");
