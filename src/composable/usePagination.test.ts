import { describe, expect, it } from "vitest";
import { usePagination } from "./usePagination";

describe("usePagination", () => {
  it("should change page", async () => {
    const { changePage, currentPage } = usePagination();
    changePage(2);
    expect(currentPage.value).toBe(2);
  });

  it("should change page size", async () => {
    const { changePageSize, pageSize } = usePagination();
    changePageSize(20);
    expect(pageSize.value).toBe(20);
  });

  it("should calculate offset", async () => {
    const { offset, currentPage, pageSize } = usePagination();
    currentPage.value = 4;
    pageSize.value = 10;
    expect(offset.value).toBe(30);
  });
});
