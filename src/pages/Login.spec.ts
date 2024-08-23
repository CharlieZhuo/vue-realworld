import { describe, expect, it } from "vitest";
import Login from "./Login.vue";
import { flushPromises, mount } from "@vue/test-utils";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import {
  testPassword,
  testUser,
  mockUserManager,
  mockUserStore,
} from "../utils/testMockObjects";
import { testRouter } from "../utils/testUtils";

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

  // it("should make api call when submit with correct form", async () => {
  //   const wrapper = mount(Login, {
  //     global: {
  //       plugins: [testRouter, mockUserManager.UserPlugin],
  //     },
  //   });
  //   const baseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
  //   const server = setupServer(
  //     http.post(`${baseUrl}/users/login`, async ({ request }) => {
  //       console.log(request.body);
  //       return HttpResponse.json(testUser);
  //     })
  //   );
  //   server.listen({ onUnhandledRequest: "error" });

  //   await wrapper.find('input[type="email"]').setValue(testUser.email);
  //   await wrapper.find('input[type="password"]').setValue(testPassword);
  //   await wrapper.find("form").trigger("submit");
  //   await flushPromises();
  //   await flushPromises();
  //   expect(wrapper.find(".error-messages li").text()).toBe("success");
  //   expect(mockUserStore.get()).toBe(testUser);

  //   server.close();
  // });

  // it("should display error message if api call respond with error", async () => {
  //   const wrapper = mount(Login, {
  //     global: {
  //       plugins: [testRouter, mockUserManager.UserPlugin],
  //     },
  //   });

  //   await wrapper.find('input[type="email"]').setValue('wrongemail@g.com');
  //   await wrapper.find('input[type="password"]').setValue("wrongpassword");
  //   await wrapper.find('button[type="submit"]').trigger("click");
  //   await flushPromises();
  //   expect(mockUserManager.CurrentUser).toBe(null);
  //   expect(wrapper.find(".error-message li").text).toBe('Unauthorized');
  // });
});
