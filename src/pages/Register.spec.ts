import { beforeEach, describe, expect, it } from "vitest";
import Register from "./Register.vue";
import { setupTestServer } from "../utils/testServer";
import { HttpResponse } from "msw";
import {
  testUser,
  testPassword,
  mockUserManager,
  mockUserStore,
} from "../utils/testMockObjects";

import { components } from "../api/schema";
import { flushPromises, mount } from "@vue/test-utils";
import { testRouter } from "../utils/testUtils";

type newUserType = components["schemas"]["NewUser"];

setupTestServer({
  method: "post",
  url: "/users",
  resolver: async ({ request }) => {
    const user = (await request.clone().json()).user as newUserType;
    if (
      user.email == testUser.email &&
      user.password == testPassword &&
      user.username == testUser.username
    ) {
      return HttpResponse.json({ user: testUser });
    }
    // 返回422响应:"GenericError"
    return HttpResponse.json(
      { errors: ["generic error"] },
      { status: 422, statusText: "generic error" }
    );
  },
});

beforeEach(() => {
  mockUserStore.remove();
});

describe("Register.vue", () => {
  it("should render register form", () => {
    const wrapper = mount(Register, {
      global: {
        plugins: [testRouter, mockUserManager.UserPlugin],
      },
    });
    expect(wrapper.find("form").exists()).toBe(true);
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
    expect(wrapper.find('a[href="/login"]').exists()).toBe(true);
  });
  it("should make api call when submit with correct form", async () => {
    const wrapper = mount(Register, {
      global: {
        plugins: [testRouter, mockUserManager.UserPlugin],
      },
    });
    await wrapper.get('input[type="email"]').setValue(testUser.email);
    await wrapper.get('input[type="password"]').setValue(testPassword);
    await wrapper.get('input[type="text"]').setValue(testUser.username);
    await wrapper.get("form").trigger("submit");
    expect(wrapper.get("button").attributes("disabled")).toBe("");
    await flushPromises();
    expect(
      wrapper.findAll("li").some((li) => li.text() === "Register success")
    ).toBe(true);
    expect(wrapper.get("button").attributes("disabled")).toBeUndefined();
    expect(testRouter.currentRoute.value.path).toBe("/");
    expect(mockUserStore.get()).toEqual(testUser);
  });

  it("should display error when api call return 422", async () => {
    const wrapper = mount(Register, {
      global: {
        plugins: [testRouter, mockUserManager.UserPlugin],
      },
    });
    await wrapper.get('input[type="email"]').setValue(testUser.email);
    await wrapper.get('input[type="password"]').setValue(testPassword + "1");
    await wrapper.get('input[type="text"]').setValue(testUser.username);
    await wrapper.get("form").trigger("submit");
    await flushPromises();
    expect(wrapper.get("button").attributes("disabled")).toBeUndefined();
    expect(
      wrapper.findAll("li").some((li) => li.text() === "Generic Error")
    ).toBe(true);
  });
});
