import { components } from "../api/schema";
import { ApiClient } from "../api/apiClient";
import { computed, ref, watch } from "vue";

export interface useArticlesProps {
  myFeed?: boolean;
  tagName?: string;
  authorName?: string;
  favoritedBy?: string;
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
    if (props.myFeed) {
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
            tag: props.tagName,
            author: props.authorName,
            favorited: props.favoritedBy,
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

  //FeedMode改变时，重置页码并重新获取数据
  watch(
    () => props,
    () => {
      if (currentPage.value == 1) {
        startProcess();
      } else {
        currentPage.value = 1;
      }
    }
  );

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
  };
}
