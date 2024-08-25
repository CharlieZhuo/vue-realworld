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

type Profile = components["schemas"]["Profile"];
export const testProfileA: Profile = {
  username: "test",
  bio: "test bio",
  image: "https://randomuser.me/api/portrait",
  following: false,
};
export const testProfileB: Profile = {
  username: "test2",
  bio: "test bio",
  image: "https://randomuser.me/api/portrait",
  following: false,
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

type article = components["schemas"]["Article"];

export const testArticlesSetA: article[] = [
  {
    slug: "test-article",
    title: "Test Article",
    description: "This is a test article",
    body: "This is a test article",
    tagList: ["test"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    favorited: false,
    favoritesCount: 0,
    author: testProfileA,
  },
  {
    slug: "test-article-2",
    title: "Test Article 2",
    description: "This is a test article",
    body: "This is a test article",
    tagList: ["test"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    favorited: false,
    favoritesCount: 0,
    author: testProfileB,
  },
];

export const testArticlesSetB: article[] = [
  {
    slug: "test-article-3",
    title: "Test Article 3",
    description: "This is a test article",
    body: "This is a test article",
    tagList: ["test"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    favorited: false,
    favoritesCount: 0,
    author: testProfileA,
  },
  {
    slug: "test-article-4",
    title: "Test Article 4",
    description: "This is a test article",
    body: "This is a test article",
    tagList: ["test"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    favorited: false,
    favoritesCount: 0,
    author: testProfileB,
  },
];

export const mockUserStore = new MockStore<User>();
export const mockUserManager = new UserManager(mockUserStore);
