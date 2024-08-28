import { describe, it, expect } from "vitest";
import { useTags } from "./useTags";
import { setupTestServer } from "../utils/testServer";
import { HttpResponse } from "msw";
import { flushPromises } from "@vue/test-utils";

const mockTags = ["tag1", "tag2"];

setupTestServer({
  method: "get",
  url: "/tags",
  resolver: async () => {
    return HttpResponse.json({ tags: mockTags });
  },
});

describe("useTags", () => {
  it("should return tags and isProcessing", async () => {
    const { tags, isProcessing } = useTags();
    expect(tags.value).toEqual([]);
    expect(isProcessing.value).toBe(true);
    await flushPromises();
    expect(tags.value).toEqual(mockTags);
    expect(isProcessing.value).toBe(false);
  });
});
