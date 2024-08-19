import { createWebHashHistory, createRouter, RouteRecordRaw } from "vue-router";
import Home from "./pages/Home.vue";
import Article from "./pages/Article.vue";
import { BrowserUserManager } from "./plugins/BrowserUserManager";

export const routes: RouteRecordRaw[] = [
  { path: "/", component: Home, name: "home", props: { feedMode: "global" } },
  {
    path: "/my-feeds",
    component: Home,
    name: "my-feeds",
    props: { feedMode: "my" },
    beforeEnter: () => {
      return BrowserUserManager.IsLoggedIn() ? true : { name: "home" };
    },
  },
  {
    path: "/tag/:tag",
    component: Home,
    name: "tag-feeds",
    props: (route) => ({ feedMode: route.params.tag }),
  },

  {
    path: "/article/:id",
    component: Article,
    name: "article",
    props: (route) => ({
      slug: route.params.id,
    }),
  },
  {
    path: "/login",
    component: () => import("./pages/Login.vue"),
    name: "login",
    beforeEnter: () => !BrowserUserManager.IsLoggedIn(),
  },
  {
    path: "/register",
    component: () => import("./pages/Register.vue"),
    name: "register",
    beforeEnter: () => !BrowserUserManager.IsLoggedIn(),
  },
  {
    path: "/profile/:username",
    alias: "/profile/:username/favorites",
    component: () => import("./pages/Profile.vue"),
    name: "profile",
    beforeEnter: () => BrowserUserManager.IsLoggedIn(),
  },
  {
    path: "/settings",
    component: () => import("./pages/Setting.vue"),
    name: "settings",
    beforeEnter: () => BrowserUserManager.IsLoggedIn(),
  },
  {
    path: "/editor",
    component: () => import("./pages/Editor.vue"),
    name: "create-article",
    beforeEnter: () => BrowserUserManager.IsLoggedIn(),
  },
  {
    path: "/editor/:articleId",
    component: () => import("./pages/Editor.vue"),
    name: "edit-article",
    props: (route) => ({
      articleId: route.params.articleId,
    }),

    beforeEnter: () => BrowserUserManager.IsLoggedIn(),
  },
];
export type AppRouteNames =
  | "home"
  | "article"
  | "login"
  | "register"
  | "profile"
  | "settings"
  | "create-article"
  | "edit-article"
  | "profile-favorites";

export function routerPushTyped(route: AppRouteNames): void {
  router.push({ name: route });
}

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
