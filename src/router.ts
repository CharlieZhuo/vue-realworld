import { createWebHashHistory, createRouter, RouteRecordRaw } from "vue-router";
import Home from "./pages/Home.vue";
import Article from "./pages/Article.vue";
import { BrowserUserManager } from "./plugins/BrowserUserManager";

export const routes: RouteRecordRaw[] = [
  { path: "/", component: Home, name: "home" },
  {
    path: "/my-feeds",
    component: Home,
    name: "my-feeds",
    props: { myFeed: true },
    beforeEnter: () => {
      return BrowserUserManager.IsLoggedIn() ? true : { name: "home" };
    },
  },
  {
    path: "/tag/:tag",
    component: Home,
    name: "tag-feeds",
    props: (route) => ({ tagName: route.params.tag }),
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
    component: () => import("./pages/Profile.vue"),
    name: "profile",
    beforeEnter: () => BrowserUserManager.IsLoggedIn(),
    props: { feedMode: "profile" },
  },
  {
    path: "/profile/:username/favorites",
    component: () => import("./pages/Profile.vue"),
    name: "profile-favorites",
    beforeEnter: () => BrowserUserManager.IsLoggedIn(),
    props: { feedMode: "favorites" },
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
