import { beforeEach, describe, expect, it } from "vitest";
import Login from "./Login.vue";
import { flushPromises, mount } from "@vue/test-utils";
import {
  testPassword,
  testUser,
  mockUserManager,
  mockUserStore,
} from "../utils/testMockObjects";
import { testRouter } from "../utils/testUtils";
import { setupTestServer } from "../utils/testServer";
import { HttpResponse } from "msw";
import { components } from "../api/schema";

type loginUserType = components["schemas"]["LoginUser"];

setupTestServer({
  method: "post",
  url: "/users/login",
  resolver: async ({ request }) => {
    const user = (await request.clone().json()).user as loginUserType;
    if (user.email == testUser.email && user.password == testPassword) {
      return HttpResponse.json({ user: testUser });
    }
    // 返回401响应:"Unauthorized"
    return HttpResponse.text(null, { status: 401, statusText: "Unauthorized" });
  },
});

beforeEach(() => {
  mockUserStore.remove();
});

describe("Login.vue", () => {
  it("should render login form", () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [testRouter, mockUserManager.UserPlugin],
      },
    });
    expect(wrapper.find("form").exists()).toBe(true);
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
    expect(wrapper.find('a[href="/register"]').exists()).toBe(true);
  });

  it("should make api call when submit with correct form", async () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [testRouter, mockUserManager.UserPlugin],
      },
    });

    await wrapper.get('input[type="email"]').setValue(testUser.email);
    await wrapper.get('input[type="password"]').setValue(testPassword);
    await wrapper.get("form").trigger("submit");
    expect(wrapper.get("button").attributes("disabled")).toBe("");
    await flushPromises();

    expect(
      wrapper.findAll("li").some((li) => li.text() === "Login success")
    ).toBe(true);
    expect(testRouter.currentRoute.value.path).toBe("/");
    expect(mockUserStore.get()).toEqual(testUser);
  });

  it("should display error message if api call respond with error", async () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [testRouter, mockUserManager.UserPlugin],
      },
    });

    await wrapper.get('input[type="email"]').setValue(testUser.email);
    await wrapper.get('input[type="password"]').setValue(testPassword + "1");
    await wrapper.get("form").trigger("submit");
    expect(wrapper.get("button").attributes("disabled")).toBe("");
    
    await flushPromises();

    expect(
      wrapper.findAll("li").some((li) => li.text() === "Unauthorized access")
    ).toBe(true);
    expect(testRouter.currentRoute.value.path).toBe("/");
    expect(mockUserStore.get()).toBeNull();
  });
});
