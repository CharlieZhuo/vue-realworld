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

// 8 articles generated
export const testArticlesSetA: article[] = Array.from(
  { length: 8 },
  (_, i) => ({
    slug: `test-article-${i}`,
    title: `Test Article ${i}`,
    description: "This is a test article",
    body: "This is a test article",
    tagList: [`tag${i}`],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    favorited: false,
    favoritesCount: 0,
    author: {
      username: `test${i}`,
      bio: "test bio",
      image: "https://randomuser.me/api/portrait",
      following: false,
    },
  })
);

// with 10 articles generated programmatically
export const testArticlesSetB: article[] = Array.from(
  { length: 10 },
  (_, i) => ({
    slug: `test-article-${i}`,
    title: `Test Article ${i}`,
    description: "This is a test article",
    body: "This is a test article",
    tagList: [`tag${i}`],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // randomly set favorited to true
    favorited: Math.random() > 0.5,
    favoritesCount: 0,
    author: {
      username: `test${i}`,
      bio: "test bio",
      image: "https://randomuser.me/api/portrait",
      following: false,
    },
  })
);

type comment = components["schemas"]["Comment"];
export const mockComments: comment[] = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  body: "test comment",
  author: {
    username: "test",
    bio: "test bio",
    image: "https://randomuser.me/api/portrait",
    following: false,
  },
}));

export const mockUserStore = new MockStore<User>();
export const mockUserManager = new UserManager(mockUserStore);
