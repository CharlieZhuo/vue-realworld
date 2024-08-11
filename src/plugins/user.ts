import type { components } from "../api/schema";
import BrowserKVStore from "../stores/BrowserKVStore";
import { InjectionKey, Plugin, ref } from "vue";

type User = components["schemas"]["User"];

const userStore = new BrowserKVStore<User>("user");

export interface UserManager {
  CurrentUser: User | null;
  Login: (user: User) => void;
  Logout: () => void;
}

export function IsLoggedIn(): boolean {
  return userStore.get() !== null;
}

export const UserKey: InjectionKey<UserManager> = Symbol("UserManager");

export const userPlugin: Plugin = {
  install(app) {
    const userRef = ref(userStore.get());
    app.provide(UserKey, {
      CurrentUser: userRef.value,
      Login: (user: User) => {
        userStore.set(user);
        userRef.value = user;
      },
      Logout: () => {
        userStore.remove();
        userRef.value = null;
      },
    });
  },
};
