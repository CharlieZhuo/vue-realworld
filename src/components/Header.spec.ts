import { describe, it, expect, beforeEach } from "vitest";
import Header from "./Header.vue";
import { mount } from "@vue/test-utils";

import { testRouter } from "../utils/testUtils";
import {
  mockUserManager,
  mockUserStore,
  testUser,
} from "../utils/testMockObjects";

beforeEach(() => {
  mockUserStore.remove();
});

describe("Header.vue", () => {
  it("should render link to homepage", () => {
    const wrapper = mount(Header, {
      global: {
        plugins: [testRouter, mockUserManager.UserPlugin],
      },
    });
    expect(wrapper.findComponent("a").text()).toBe("conduit");
  });
  it("should render link to home, sign up, sign in when not authenticated", () => {
    const wrapper = mount(Header, {
      global: {
        plugins: [testRouter, mockUserManager.UserPlugin],
      },
    });
    const links = wrapper.findAll("ul li a");
    expect(links.length).toBe(3);
    expect(links[0].text()).toBe("Home");
    expect(links[1].text()).toBe("Sign up");
    expect(links[2].text()).toBe("Sign in");
  });
  it("should render link to home, new post, settings and profile when authenticated", () => {
    mockUserStore.set(testUser);
    const wrapper = mount(Header, {
      global: {
        plugins: [testRouter, mockUserManager.UserPlugin],
      },
    });

    const links = wrapper.findAll("ul li a");
    expect(links.length).toBe(4);
    expect(links[0].text()).toBe("Home");
    expect(links[1].text()).toBe("New Post");
    expect(links[2].text()).toBe("Settings");
    expect(links[3].text()).toBe(testUser.username);
  });
});
