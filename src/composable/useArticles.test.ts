import { describe, expect, it } from "vitest";
import { HttpResponse, HttpResponseResolver } from "msw";
import {
  testArticlesSetA as mockFeedArticles,
  testArticlesSetB as mockArticles,
} from "../utils/testMockObjects";
import { flushPromises } from "@vue/test-utils";
import { useArticles } from "./useArticles";
import { setupTestServer } from "../utils/testServer";
import { components } from "../api/schema";

type articleType = components["schemas"]["Article"];

function generatePaginateResolver(source: articleType[]): HttpResponseResolver {
  return async ({ request }) => {
    let result = [...source];
    const url = new URL(request.url);
    const limit = url.searchParams.get("limit");
    const offset = url.searchParams.get("offset");
    const tagName = url.searchParams.get("tag");
    const authorName = url.searchParams.get("author");
    const favoritedBy = url.searchParams.get("favorited");
    if (tagName)
      result = result.filter((article) => article.tagList.includes(tagName));
    if (authorName)
      result = result.filter(
        (article) => article.author.username === authorName
      );
    if (favoritedBy)
      result = result.filter((article) => article.favorited === true);
    return HttpResponse.json({
      articles:
        limit && offset
          ? result.slice(Number(offset), Number(offset) + Number(limit))
          : result,
      articlesCount: result.length,
    });
  };
}

setupTestServer(
  {
    method: "get",
    url: "/articles/feed",
    resolver: generatePaginateResolver(mockFeedArticles),
  },
  {
    method: "get",
    url: "/articles",
    resolver: generatePaginateResolver(mockArticles),
  }
);

describe("useArticles", () => {
  it("should fetch articles and return total articles count", async () => {
    const { articles, totalCount } = useArticles({ immediate: true });
    expect(articles.value.length).toBe(0);
    await flushPromises();
    expect(articles.value).toEqual(mockArticles);
    expect(totalCount.value).toBe(mockArticles.length);
  });
  it("should return processing state", async () => {
    const { isProcessing } = useArticles({ immediate: true });
    expect(isProcessing.value).toBe(true);
    await flushPromises();
    expect(isProcessing.value).toBe(false);
  });
  it("should generate request with pagination parameters", async () => {
    const { changePage, changePageSize, startProcess, articles, currentPage } =
      useArticles({});
    changePageSize(2);
    changePage(3);
    startProcess();
    await flushPromises();
    expect(currentPage.value).toBe(3);
    expect(articles.value.length).toBe(2);
    expect(articles.value[0].slug).toBe(mockArticles[4].slug);
    changePage(1);
    changePageSize(3);
    await flushPromises();
    expect(currentPage.value).toBe(1);
    expect(articles.value.length).toBe(3);
    expect(articles.value[0].slug).toBe(mockArticles[0].slug);
  });
  it("should fetch feed articles", async () => {
    const { articles } = useArticles({ myFeed: true, immediate: true });
    await flushPromises();
    expect(articles.value).toEqual(mockFeedArticles);
  });
  it("should generate request with tag parameter", async () => {
    const { articles } = useArticles({ tagName: "tag1", immediate: true });
    await flushPromises();
    expect(articles.value.length).toBe(1);
    expect(articles.value[0].tagList).toContain("tag1");
  });
  it("should generate request with author parameter", async () => {
    const { articles } = useArticles({ authorName: "test1", immediate: true });
    await flushPromises();
    expect(articles.value.length).toBe(1);
    expect(articles.value[0].author.username).toBe("test1");
  });
  it("should generate request with favorited parameter", async () => {
    const { articles } = useArticles({ favoritedBy: "test1", immediate: true });
    await flushPromises();
    expect(articles.value).toEqual(mockArticles.filter((a) => a.favorited));
  });
});
