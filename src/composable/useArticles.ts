import { components } from "../api/schema";
import { ApiClient } from "../api/apiClient";
import { computed, ref, watch } from "vue";

export interface useArticlesProps {
  feedMode: "global" | "my" | string;
}

import { useAsync } from "./useAsync";
import { defaultPageSize } from "../api/apiClient";

export function useArticles(props: useArticlesProps) {
  const articles = ref<components["schemas"]["Article"][]>([]);
  const totalArticles = ref<number>(0);
  const currentPage = ref(1);
  const feedMode = ref(props.feedMode);

  const offset = computed(() => (currentPage.value - 1) * defaultPageSize);

  function changePage(to: number) {
    currentPage.value = to;
  }
  function changeFeedMode(mode: string) {
    feedMode.value = mode;
  }

  function fetchArticles() {
    if (feedMode.value == "my") {
      return ApiClient.GET("/articles/feed", {
        params: {
          query: {
            limit: defaultPageSize,
            offset: offset.value,
          },
        },
      }).then(({ data }) => {
        if (data) {
          articles.value = data?.articles;
          totalArticles.value = data?.articlesCount;
        }
      });
    } else {
      return ApiClient.GET("/articles", {
        params: {
          query: {
            limit: defaultPageSize,
            offset: offset.value,
            tag: feedMode.value == "global" ? undefined : feedMode.value,
          },
        },
      }).then(({ data }) => {
        if (data) {
          articles.value = data?.articles;
          totalArticles.value = data?.articlesCount;
        }
      });
    }
  }
  const { startProcess, isProcessing } = useAsync(fetchArticles);

  watch(feedMode, () => {
    if (currentPage.value == 1) {
      startProcess();
    } else {
      currentPage.value = 1;
    }
  });

  watch(
    [currentPage],
    () => {
      startProcess();
    },
    { immediate: true }
  );

  return {
    articles,
    totalArticles,
    isProcessing,
    currentPage,
    changePage,
    changeFeedMode,
  };
}
