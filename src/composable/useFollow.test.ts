import { describe, expect, it } from "vitest";
import { useFollow } from "./useFollow";
import { setupTestServer } from "../utils/testServer";
import { HttpResponse } from "msw";
import { testProfileA } from "../utils/testMockObjects";

setupTestServer(
  {
    method: "post",
    url: "/profiles/:username/follow",
    resolver: async ({ params }) => {
      const { username } = params;
      if (username == testProfileA.username) {
        return HttpResponse.json({
          profile: { ...testProfileA, following: true },
        });
      }
    },
  },
  {
    method: "delete",
    url: "/profiles/:username/follow",
    resolver: async ({ params }) => {
      const { username } = params;
      if (username == testProfileA.username) {
        return HttpResponse.json({
          profile: { ...testProfileA, following: false },
        });
      }
    },
  }
);

describe("useFollow", () => {
  it("should follow user", async () => {
    const { isProcessing, startFollow } = useFollow(testProfileA.username);

    const userPromise = startFollow();
    expect(isProcessing.value).toBe(true);
    const user = await userPromise;

    expect(isProcessing.value).toBe(false);
    expect(user).toEqual({ ...testProfileA, following: true });
  });
  it("should unfollow user", async () => {
    const { isProcessing, startUnFollow } = useFollow(testProfileA.username);

    const userPromise = startUnFollow();
    expect(isProcessing.value).toBe(true);
    const user = await userPromise;

    expect(isProcessing.value).toBe(false);
    expect(user).toEqual({ ...testProfileA, following: false });
  });
});
