import { describe, expect, it } from "vitest";
import TagList from "./TagList.vue";
import { mount } from "@vue/test-utils";
import { testRouter } from "../utils/testUtils";

describe("TagList.vue", () => {
  it("should render tags", () => {
    const wrapper = mount(TagList, {
      global: {
        plugins: [testRouter],
      },
      props: {
        tags: ["tag1", "tag2", "tag3"],
      },
    });
    const tags = wrapper.findAll("a");
    expect(tags.length).toBe(3);
    expect(tags[0].text()).toBe("tag1");
    expect(tags[1].text()).toBe("tag2");
    expect(tags[2].text()).toBe("tag3");
    expect(tags[0].attributes("href")).toBe("/tag/tag1");
  });
  it("should render loading state", () => {
    const wrapper = mount(TagList, {
      global: {
        plugins: [testRouter],
      },
      props: {
        tags: [],
        loading: true,
      },
    });
    const tags = wrapper.findAll("a");
    expect(tags.length).toBe(1);
    expect(wrapper.find("a").text()).toBe("loading");
  });
});
