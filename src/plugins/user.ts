import type { components } from "../api/schema";
import BrowserKVStore from "../stores/BrowserKVStore";
import { InjectionKey, Plugin, ref } from "vue";

type User = components["schemas"]["User"];

const userStore = new BrowserKVStore<User>("user");

// 用于判断用户是否已经登录
// 此函数只为组件树之外使用，组件树内请inject UserKey
export function IsLoggedIn(): boolean {
  return userStore.get() !== null;
}

export interface ProvidedUserInterface {
  CurrentUser: User | null;
  Login: (user: User) => void;
  Logout: () => void;
}

export const UserKey: InjectionKey<ProvidedUserInterface> =
  Symbol("UserManager");

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
