import type { components } from "../api/schema";
type User = components["schemas"]["User"];

export const testUser: User = {
  username: "test",
  email: "example@abc.com",
  bio: "test bio",
  image: "https://randomuser.me/api/portrait",
  token: "testtoken",
};

import { Store } from "../stores/Store";

export class mockStore<T> implements Store<T> {
  private value: T | null = null;

  constructor(initialValue: T | null = null) {
    this.value = initialValue;
  }

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

