import { describe, expect, it } from "vitest";
import { useRegister } from "./useRegister";
import { setupTestServer } from "../utils/testServer";
import { testPassword, testUser } from "../utils/testMockObjects";
import { HttpResponse } from "msw";
import { flushPromises } from "@vue/test-utils";

setupTestServer({
  method: "post",
  url: "/users",
  resolver: async ({ request }) => {
    const user = (await request.clone().json()).user;
    if (
      user.email == testUser.email &&
      user.password == testPassword &&
      user.username == testUser.username
    ) {
      return HttpResponse.json({ user: testUser });
    }
    return HttpResponse.text(null, {
      status: 422,
      statusText: "Generic Error",
    });
  },
});

describe("useRegister", () => {
  it("should return registerFormState, isProcessing and startProcess", () => {
    const { registerFormState, isProcessing, startProcess } = useRegister();
    expect(registerFormState).toBeDefined();
    expect(isProcessing).toBeDefined();
    expect(startProcess).toBeDefined();
  });

  it("should make POST request to API when startProcess is called", async () => {
    const { startProcess, registerFormState, isProcessing } = useRegister();
    registerFormState.value = {
      email: testUser.email,
      password: testPassword,
      username: testUser.username,
    };
    const result = startProcess();
    expect(isProcessing.value).toBe(true);
    await flushPromises();
    expect(isProcessing.value).toBe(false);
    expect(result).resolves.toEqual(testUser);
  });

  it("should throw error when register fails", async () => {
    const { startProcess, registerFormState } = useRegister();
    registerFormState.value = {
      email: testUser.email,
      password: testPassword,
      username: "",
    };
    expect(startProcess()).rejects.toThrow("Generic Error");
  });
});
