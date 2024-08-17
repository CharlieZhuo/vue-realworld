<template>
  <nav class="navbar navbar-light">
    <div class="container">
      <RouterLink :to="{ name: 'home' }" class="navbar-brand"
        >conduit</RouterLink
      >
      <ul class="nav navbar-nav pull-xs-right">
        <li class="nav-item" v-for="item in displayedNavItems" :key="item.name">
          <RouterLink
            :to="{ name: item.toRoute, params: item.params }"
            active-class="active"
            class="nav-link"
          >
            {{ item.name }}
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script setup lang="ts">
import { RouteParams, RouterLink } from "vue-router";
import { AppRouteNames } from "../router";
import { UserKey } from "../plugins/UserManager";
import { computed, inject } from "vue";

const userInject = inject(UserKey)!;

const authenticated = computed(() =>
  userInject.CurrentUser.value ? "authenticated" : "unauthenticated"
);

interface navItem {
  name: string;
  toRoute: AppRouteNames;
  params?: Partial<RouteParams>;
  authorization: "always" | "authenticated" | "unauthenticated";
}

const navItems = computed(() => {
  return [
    { name: "Home", toRoute: "home", authorization: "always" },
    {
      name: "New Post",
      toRoute: "create-article",
      authorization: "authenticated",
    },
    { name: "Settings", toRoute: "settings", authorization: "authenticated" },
    { name: "Sign up", toRoute: "register", authorization: "unauthenticated" },
    { name: "Sign in", toRoute: "login", authorization: "unauthenticated" },
    {
      name: userInject?.CurrentUser?.value?.username ?? "placeholder",
      toRoute: "profile",
      params: { username: userInject?.CurrentUser?.value?.username ?? "placeholder" },
      authorization: "authenticated",
    },
  ] as navItem[];
});

const displayedNavItems = computed(() => {
  return navItems.value.filter((item) => {
    return (
      item.authorization === "always" ||
      item.authorization === authenticated.value
    );
  });
});
</script>
