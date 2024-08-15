import type { components } from "../api/schema";
import { UserManager } from "../plugins/UserManager";
type User = components["schemas"]["User"];

export const testUser: User = {
  username: "test",
  email: "example@abc.com",
  bio: "test bio",
  image: "https://randomuser.me/api/portrait",
  token: "testtoken",
};

export const testPassword = "password";

import { Store } from "../stores/Store";

export class MockStore<T> implements Store<T> {
  private value: T | null = null;

  get() {
    return this.value;
  }
  set(value: T) {
    this.value = value;
  }
  remove() {
    this.value = null;
  }
}

export const mockUserStore = new MockStore<User>();
export const mockUserManager=new UserManager(mockUserStore);