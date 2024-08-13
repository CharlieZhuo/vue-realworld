import { InjectionKey, Plugin, ref } from "vue";

import type { components } from "../api/schema";
type User = components["schemas"]["User"];

export interface ProvidedUserInterface {
  CurrentUser: User | null;
  Login: (user: User) => void;
  Logout: () => void;
}

export const UserKey: InjectionKey<ProvidedUserInterface> =
  Symbol("UserManager");

import { Store } from "../stores/Store";

export class UserManager {
  private userStore: Store<User>;
  constructor(userStore: Store<User>) {
    this.userStore = userStore;
  }
  // 用于判断用户是否已经登录
  // 此函数只为组件树之外使用，组件树内请用plugin中inject的对象
  public IsLoggedIn(): boolean {
    return this.userStore.get() !== null;
  }
  public get CurrentUser() {
    return this.userStore.get();
  }

  public get UserPlugin(): Plugin {
    return createUserPlugin(this.userStore);
  }
}

export function createUserPlugin(userStore: Store<User>): Plugin {
  return {
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
}
