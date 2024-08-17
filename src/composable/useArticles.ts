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

  const offset = computed(() => (currentPage.value - 1) * defaultPageSize);

  function changePage(to: number) {
    currentPage.value = to;
  }

  function fetchArticles() {
    if (props.feedMode == "my") {
      ApiClient.GET("/articles/feed", {
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
      ApiClient.GET("/articles", {
        params: {
          query: {
            limit: defaultPageSize,
            offset: offset.value,
            tag: props.feedMode == "global" ? undefined : props.feedMode,
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
  const { startProcess, isProcessing } = useAsync({
    process: fetchArticles,
  });

  watch(
    [currentPage],
    () => {
      startProcess();
    },
    { immediate: true }
  );

  return { articles, totalArticles, isProcessing, currentPage, changePage };
}
