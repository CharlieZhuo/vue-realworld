import { describe, expect, it } from "vitest";
import FollowButton from "./FollowButton.vue";
import { flushPromises, mount } from "@vue/test-utils";
import { testProfileA } from "../utils/testMockObjects";
import { setupTestServer } from "../utils/testServer";
import { HttpResponse } from "msw";

setupTestServer(
  {
    method: "post",
    url: `/profiles/${testProfileA.username}/follow`,
    resolver: async () => {
      return HttpResponse.json({
        profile: { ...testProfileA, following: true },
      });
    },
  },
  {
    method: "delete",
    url: `/profiles/${testProfileA.username}/follow`,
    resolver: async () => {
      return HttpResponse.json({
        profile: { ...testProfileA, following: false },
      });
    },
  }
);

describe("FollowButton.vue", () => {
  describe("when author is not followed", () => {
    const wrapper = mount(FollowButton, {
      props: { author: testProfileA },
    });

    it("should render follow button", () => {
      expect(wrapper.find("button").text()).toBe(
        `Follow ${testProfileA.username}`
      );
    });

    it(
      "should make POST api call to follow when clicked," +
        "and emit event after receiving response",
      async () => {
        await wrapper.find("button").trigger("click");
        expect(wrapper.find("button").attributes("disabled")).toBe("");
        await flushPromises();
        expect(wrapper.find("button").attributes("disabled")).toBe(undefined);
        expect(wrapper.emitted("authorChange")![0][0]).toEqual({
          ...testProfileA,
          following: true,
        });
      }
    );
  });
  describe("when author is already followed", () => {
    const wrapper = mount(FollowButton, {
      props: { author: { ...testProfileA, following: true } },
    });

    it("should render unfollow button", async () => {
      expect(wrapper.find("button").text()).toBe(
        `Unfollow ${testProfileA.username}`
      );
    });

    it("should make DELETE api call to unfollow when clicked", async () => {
      await wrapper.find("button").trigger("click");
      expect(wrapper.find("button").attributes("disabled")).toBe("");
      await flushPromises();
      expect(wrapper.find("button").attributes("disabled")).toBe(undefined);
      expect(wrapper.emitted("authorChange")![0][0]).toEqual({
        ...testProfileA,
        following: false,
      });
    });
  });
});
