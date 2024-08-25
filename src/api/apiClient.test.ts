import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { ApiClient, updateClientToken } from "./apiClient";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { testArticles } from "../utils/testMockObjects";

const baseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
const server = setupServer(
  http.get(`${baseUrl}/articles`, async ({}) => {
    return HttpResponse.json({
      articles: testArticles,
      articlesCount: testArticles.length,
    });
  })
);
server.listen({ onUnhandledRequest: "error" });

beforeAll(() => void server.listen());
afterEach(() => void server.resetHandlers());
afterAll(() => void server.close());

describe("apiClient", () => {
  it("should be defined", () => {
    expect(ApiClient).toBeDefined();
  });
  it("should update token", () => {
    const token = undefined;
    const Client = updateClientToken(token);
    expect(Client).toBeDefined();
  });

  it("should fetch articles", async () => {
    const result = await ApiClient.GET("/articles", {
      limit: 10,
      offset: 0,
    }).then(({ data }) => {
      return data;
    });
    expect(result).not.toBeNull();
    expect(result!.articles).toEqual(testArticles);
    expect(result!.articlesCount).toBe(testArticles.length);
  });
});
