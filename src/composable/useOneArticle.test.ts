import { describe, expect, it } from "vitest";
import { useOneArticle } from "./useOneArticle";

import { testArticlesSetA } from "../utils/testMockObjects";
import { flushPromises } from "@vue/test-utils";
import { setupTestServer } from "../utils/testServer";
import { HttpResponse } from "msw";

const testArticle = testArticlesSetA[0];

setupTestServer({
  method: "get",
  url: "/articles/:slug",
  resolver: async ({ params }) => {
    const { slug } = params;
    if (slug == testArticle.slug) {
      return HttpResponse.json({ article: testArticle });
    }
  },
});

describe("useOneArticle", () => {
  it("should fetch one article", async () => {
    const { article, isProcessing, startProcess } = useOneArticle(
      testArticle.slug
    );
    expect(article.value).toBe(undefined);
    startProcess();
    expect(isProcessing.value).toBe(true);
    await flushPromises();

    expect(article.value).toEqual(testArticle);
    expect(isProcessing.value).toBe(false);
  });
});
