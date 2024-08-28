import { describe, expect, it } from "vitest";
import { useProfile } from "./useProfile";

import { testProfileA } from "../utils/testMockObjects";
import { flushPromises } from "@vue/test-utils";
import { setupTestServer } from "../utils/testServer";
import { HttpResponse } from "msw";

setupTestServer({
  method: "get",
  url: "/profiles/:username",
  resolver: async ({ params }) => {
    const { username } = params;
    if (username == testProfileA.username) {
      return HttpResponse.json({ profile: testProfileA });
    }
  },
});

describe("useProfile", () => {
  it("should fetch profile", async () => {
    const { isProcessing, profile } = useProfile(testProfileA.username);
    expect(profile.value).toBe(undefined);
    expect(isProcessing.value).toBe(true);
    await flushPromises();
    expect(profile.value).toEqual(testProfileA);
    expect(isProcessing.value).toBe(false);
  });
});
