import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { router } from "./router";
import { userPlugin } from "./plugins/user";

const app = createApp(App).use(userPlugin).use(router);


app.mount("#app");
