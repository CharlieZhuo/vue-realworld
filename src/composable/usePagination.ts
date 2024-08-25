import { ref, computed } from "vue";
import { defaultPageSize } from "../api/apiClient";

export function usePagination() {
  const currentPage = ref(1);
  const pageSize = ref(defaultPageSize);

  const offset = computed(() => (currentPage.value - 1) * pageSize.value);

  function changePage(to: number) {
    currentPage.value = to;
  }
  function changePageSize(size: number) {
    pageSize.value = size;
  }

  return {
    currentPage,
    pageSize,
    offset,
    changePage,
    changePageSize,
  };
}