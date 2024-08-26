import { describe, expect, it } from "vitest";
import { useFavorite } from "./useFavorite";
import { setupTestServer } from "../utils/testServer";
import { HttpResponse } from "msw";
import { testArticlesSetA } from "../utils/testMockObjects";
import { flushPromises } from "@vue/test-utils";

const mockArticle = testArticlesSetA[0];

const testSlug = "test-slug";
setupTestServer({
  method: "post",
  url: "/articles/:slug/favorite",
  resolver: async ({ params }) => {
    const { slug } = params;
    if (slug == testSlug) {
      return HttpResponse.json({
        article: { ...mockArticle, favorited: true },
      });
    }
  },
},
{
    method:'delete',
    url:'/articles/:slug/favorite',
    resolver:async({params})=>{
        const {slug} = params;
        if(slug == testSlug){
            return HttpResponse.json({
                article:{...mockArticle, favorited:false}
            })
        }
    }

});

describe("useFavorite", () => {
  it("should favorite article", async () => {
    const { isProcessing, startFavorite } = useFavorite(
      testSlug
    );
    const article= startFavorite();
    expect(isProcessing.value).toBe(true);
    await flushPromises();
    expect(isProcessing.value).toBe(false);
    expect((await article)?.favorited).toBe(true);
  });
  it("should unfavorite article", async () => {
    const { isProcessing, startUnFavorite } = useFavorite(
      testSlug
    );
    const article= startUnFavorite();
    expect(isProcessing.value).toBe(true);
    await flushPromises();
    expect(isProcessing.value).toBe(false);
    expect((await article)?.favorited).toBe(false);
  });
});
