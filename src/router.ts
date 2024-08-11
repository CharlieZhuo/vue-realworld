import { createWebHashHistory, createRouter, RouteRecordRaw } from "vue-router";
import Home from "./pages/Home.vue";
import Article from "./pages/Article.vue";

const routes: RouteRecordRaw[] = [
  { path: "/", component: Home, name: "home" },
  { path: "/article/:id", component: Article, name: "article" },
  {
    path: "/login",
    component: () => import("./pages/Login.vue"),
    name: "login",
  },
  {
  path: "/register",
  component: () => import("./pages/Register.vue"),
  name: "register",
  },
  {
    path:"/profile/:username",
    alias:"/profile/:username/favorites",
    component: () => import("./pages/Profile.vue"),
    name: "profile"
  },
  {
    path:"/settings",
    component: () => import("./pages/Setting.vue"),
    name: "settings"
  }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
