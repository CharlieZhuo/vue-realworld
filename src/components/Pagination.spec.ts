import { describe, expect, it } from "vitest";
import Pagination from "./Pagination.vue";
import { mount } from "@vue/test-utils";

describe("Pagination.vue", () => {
  it("should render nothing if total items count is less than page size", () => {
    const wrapper = mount(Pagination, {
      props: {
        total: 5,
        pageSize: 10,
        currentPage: 1,
      },
    });
    expect(wrapper.find("a").exists()).toBe(false);
  });

  describe("given 35 items, page size of 10 and current page of 2", () => {
    const wrapper = mount(Pagination, {
      props: {
        total: 35,
        pageSize: 10,
        currentPage: 2,
      },
    });
    it("should render 4 links", () => {
      expect(wrapper.findAll("li a").length).toBe(4);
      const links = wrapper.findAll("a");
      expect(links[0].text()).toBe("1");
      expect(links[1].text()).toBe("2");
      expect(links[2].text()).toBe("3");
      expect(links[3].text()).toBe("4");
    });
    it("should apply active class to second link", () => {
      expect(wrapper.find("li:nth-child(2)").classes()).toContain("active");
    });
    it("should emit page change event when link is clicked", async () => {
      const links = wrapper.findAll("a");
      links[3].trigger("click");
      const events = wrapper.emitted("pageChange");

      expect(events).toHaveLength(1);
      expect(events![0]).toEqual([4]);
    });
  });
});
