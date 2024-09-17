import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import FavoriteButton from "./FavoriteButton.vue";
import { testArticlesSetA } from "../utils/testMockObjects";
import { setupTestServer } from "../utils/testServer";
import { HttpResponse } from "msw";
import { components } from "../api/schema";

setupTestServer(
  {
    method: "post",
    url: `/articles/${testArticlesSetA[0].slug}/favorite`,
    resolver: async () => {
      return HttpResponse.json({
        article: {
          ...testArticlesSetA[0],
          favorited: true,
          favoritesCount: testArticlesSetA[0].favoritesCount + 1,
        } as components["schemas"]["Article"],
      });
    },
  },
  {
    method: "delete",
    url: `/articles/${testArticlesSetA[0].slug}/favorite`,
    resolver: async () => {
      return HttpResponse.json({
        article: {
          ...testArticlesSetA[0],
          favorited: false,
        } as components["schemas"]["Article"],
      });
    },
  }
);

describe("FavoriteButton.vue", () => {
  describe("when article prop is not favorited", () => {
    const wrapper = mount(FavoriteButton, {
      props: { article: { ...testArticlesSetA[0], favorited: false } },
    });

    it("should render favorite button with favorite count", () => {
      expect(wrapper.find("button").text()).toBe(
        testArticlesSetA[0].favoritesCount.toString()
      );
      expect(wrapper.find("button").classes()).toContain("btn-outline-primary");
    });

    it(
      "should make POST api call to favorite when clicked," +
        "and emit event after receiving response",
      async () => {
        await wrapper.find("button").trigger("click");
        expect(wrapper.find("button").attributes("disabled")).toBe("");
        await flushPromises();
        expect(wrapper.find("button").attributes("disabled")).toBe(undefined);
        expect(wrapper.emitted("articleChange")![0][0]).toEqual({
          ...testArticlesSetA[0],
          favorited: true,
          favoritesCount: testArticlesSetA[0].favoritesCount + 1,
        });
      }
    );
  });
  describe("when article prop is favorited", () => {
    const wrapper = mount(FavoriteButton, {
      props: {
        article: {
          ...testArticlesSetA[0],
          favorited: true,
          favoritesCount: testArticlesSetA[0].favoritesCount + 1,
        },
      },
    });
    it("should render unfavorite button with favorite count", () => {
      expect(wrapper.find("button").text()).toBe(
        testArticlesSetA[0].favoritesCount + 1 + ""
      );
      expect(wrapper.find("button").classes()).toContain("btn-primary");
    });

    it(
      "should make DELETE api call to unfavorite when clicked," +
        "and emit event after receiving response",
      async () => {
        await wrapper.find("button").trigger("click");
        expect(wrapper.find("button").attributes("disabled")).toBe("");
        await flushPromises();
        expect(wrapper.find("button").attributes("disabled")).toBe(undefined);
        expect(wrapper.emitted("articleChange")![0][0]).toEqual({
          ...testArticlesSetA[0],
          favorited: false,
        });
      }
    );
  });
});
