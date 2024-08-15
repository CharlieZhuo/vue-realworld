import { createRouter, createWebHistory } from "vue-router";
import { routes } from "../router";

export const testRouter = createRouter({
  history: createWebHistory(),
  routes: routes,
});


