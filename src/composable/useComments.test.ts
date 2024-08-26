import { describe, expect, it } from "vitest";
import { useComments } from "./useComments";
import { setupTestServer } from "../utils/testServer";
import { mockComments } from "../utils/testMockObjects";
import { HttpResponse } from "msw";
import { flushPromises } from "@vue/test-utils";
import { components } from "../api/schema";

const testSlug = "test-slug";
setupTestServer({
  method: "get",
  url: "/articles/:slug/comments",
  resolver: async ({ params }) => {
    const { slug } = params;
    if (slug == testSlug) {
      return HttpResponse.json({ comments: mockComments });
    }
  },
});

describe("useComments", () => {
  it("should fetch comments", async () => {
    const { comments, isFetchingComments } = useComments(testSlug);
    expect(comments.value.length).toBe(0);
    expect(isFetchingComments.value).toBe(true);
    await flushPromises();
    expect(comments.value).toEqual(mockComments);
    expect(isFetchingComments.value).toBe(false);
  });
  it("should add and remove comments locally", async () => {
    const { comments, addCommentLocally, removeCommentLocally } = useComments(
      testSlug
    );
    await flushPromises();
    const newComment:components['schemas']['Comment'] = {
      id: 11,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      body: "new comment",
      author:{
        username: "test",
        bio: "test bio",
        image: "https://randomuser.me/api/portrait",
        following: false
      }
    };
    addCommentLocally(newComment);
    expect(comments.value.length).toBe(mockComments.length + 1);
    expect(comments.value.some(c=>c.id==newComment.id)).toBe(true);
    removeCommentLocally(newComment.id);
    expect(comments.value.length).toBe(mockComments.length);
    expect(comments.value.some(c=>c.id==newComment.id)).toBe(false);
  });
});
