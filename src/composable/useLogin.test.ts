import { describe, expect, it } from "vitest";
import { useLogIn } from "./useLogIn";
import { HttpResponse } from "msw";
import { testUser, testPassword } from "../utils/testMockObjects";
import { setupTestServer } from "../utils/testServer";
import { flushPromises } from "@vue/test-utils";

import { components } from "../api/schema";

type loginUserType = components["schemas"]["LoginUser"];

setupTestServer({
  method: "post",
  url: "/users/login",
  resolver: async ({ request }) => {
    const user = (await request.clone().json()).user as loginUserType;
    console.log(user);
    if (user.email == testUser.email && user.password == testPassword) {
      return HttpResponse.json({ user: testUser });
    }
    // 返回401响应:"Unauthorized"
    return new HttpResponse(null, { status: 401, statusText: "Unauthorized" });
  },
});

describe("useLogIn", () => {
  it("should return loginFormState, isProcessing and startProcess", () => {
    const { loginFormState, isProcessing, startProcess } = useLogIn();
    expect(loginFormState).toBeDefined();
    expect(isProcessing).toBeDefined();
    expect(startProcess).toBeDefined();
  });

  it("should make POST request to API when startProcess is called", async () => {
    const { startProcess, loginFormState, isProcessing } = useLogIn();
    loginFormState.value = {
      email: testUser.email,
      password: testPassword,
    };
    const result = startProcess();
    expect(isProcessing.value).toBe(true);
    await flushPromises();
    expect(isProcessing.value).toBe(false);
    expect(await result).toEqual(testUser);
  });
  it("should throw error when login fails", async () => {
    const { startProcess, loginFormState } = useLogIn();
    loginFormState.value = {
      email: "",
      password: testPassword,
    };
   expect(startProcess()).rejects.toThrow("Unauthorized");
  });
});
