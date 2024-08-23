import { computed } from "vue";
import { ApiClient } from "../api/apiClient";
import { useAsync } from "./useAsync";

export function useFavorite(slug: string) {
  function favoriteArticle() {
    return ApiClient.POST(`/articles/{slug}/favorite`, {
      params: { path: { slug: slug } },
    }).then(({ data }) => {
      if (!data) {
        console.error(`Error while favoriting article ${slug}`);
      } else {
        return data.article;
      }
    });
  }

  function unFavoriteArticle() {
    return ApiClient.DELETE(`/articles/{slug}/favorite`, {
      params: { path: { slug: slug } },
    }).then(({ data }) => {
      if (!data) {
        console.error(`Error while unfavoriting article ${slug}`);
      } else {
        return data.article;
      }
    });
  }

  const { isProcessing: isFavoriteProcessing, startProcess: startFavorite } =
    useAsync(favoriteArticle);
  const { isProcessing: isFavoriteRemoving, startProcess: startUnFavorite } =
    useAsync(unFavoriteArticle);

  const isProcessing = computed(
    () => isFavoriteProcessing.value || isFavoriteRemoving.value
  );

  return {
    isProcessing,
    startFavorite,
    startUnFavorite,
  };
}
