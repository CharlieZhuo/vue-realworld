import { describe, expect, it } from "vitest";
import { ApiClient, reCreateClient } from "./apiClient";
import { HttpResponse } from "msw";
import { testArticlesSetA, testArticlesSetB } from "../utils/testMockObjects";
import { setupTestServer } from "../utils/testServer";

setupTestServer({
  method: "get",
  url: "/articles",
  resolver: async ({ request }) => {
    if (request.headers.get("Authorization") == "Bearer testToken")
      return HttpResponse.json({
        articles: testArticlesSetA,
        articlesCount: testArticlesSetA.length,
      });
    else
      return HttpResponse.json({
        articles: testArticlesSetB,
        articlesCount: testArticlesSetB.length,
      });
  },
});

describe("apiClient", () => {
  it("should be defined", () => {
    expect(ApiClient).toBeDefined();
  });

  it("should fetch articles", async () => {
    const result = await ApiClient.GET("/articles", {
      limit: 10,
      offset: 0,
    }).then(({ data }) => {
      return data;
    });
    expect(result).not.toBeNull();
    expect(result!.articles).toEqual(testArticlesSetB);
    expect(result!.articlesCount).toBe(testArticlesSetB.length);
  });
  describe("after reCreateClient() with auth token", () => {
    it("should set Authorization header in request", async () => {
      reCreateClient("testToken");
      const result = await ApiClient.GET("/articles", {
        limit: 10,
        offset: 0,
      }).then(({ data }) => {
        return data;
      });
      expect(result).not.toBeNull();
      expect(result!.articles).toEqual(testArticlesSetA);
      expect(result!.articlesCount).toBe(testArticlesSetA.length);
    });
  });
});
