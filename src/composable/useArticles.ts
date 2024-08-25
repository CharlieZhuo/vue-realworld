import { components } from "../api/schema";
import { ApiClient } from "../api/apiClient";
import { ref, watch } from "vue";

export interface useArticlesProps {
  myFeed?: boolean;
  tagName?: string;
  authorName?: string;
  favoritedBy?: string;
}

import { useAsync } from "./useAsync";
import { usePagination } from "./usePagination";

export function useArticles(props: useArticlesProps) {
  const articles = ref<components["schemas"]["Article"][]>([]);
  const totalArticles = ref<number>(0);
  
  const settingState = ref(props);
  function changeSetting(newSetting: useArticlesProps) {
    settingState.value = newSetting;
  }

  const { changePage, changePageSize, currentPage, offset, pageSize } =
    usePagination();

  function fetchArticles() {
    if (settingState.value.myFeed) {
      return ApiClient.GET("/articles/feed", {
        params: {
          query: {
            limit: pageSize.value,
            offset: offset.value,
          },
        },
      }).then(({ data }) => {
        if (data) {
          articles.value = data?.articles;
          totalArticles.value = data?.articlesCount;
          return data;
        }
      });
    } else {
      return ApiClient.GET("/articles", {
        params: {
          query: {
            limit: pageSize.value,
            offset: offset.value,
            tag: settingState.value.tagName,
            author: settingState.value.authorName,
            favorited: settingState.value.favoritedBy,
          },
        },
      }).then(({ data }) => {
        if (data) {
          articles.value = data?.articles;
          totalArticles.value = data?.articlesCount;
          return data;
        }
      });
    }
  }
  const { startProcess, isProcessing } = useAsync(fetchArticles);

  

  //FeedMode改变时，重置页码并重新获取数据
  watch(
    settingState,
    () => {
      if (currentPage.value == 1) {
        startProcess();
      } else {
        currentPage.value = 1;
      }
    },
    {
      deep: true,
    }
  );

  //页码或每页数量改变时，重新获取数据
  watch(
    [currentPage, pageSize],
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
    changePageSize,
    changeSetting,
  };
}
