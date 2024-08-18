import { ApiClient } from "../api/apiClient";
import { useAsync } from "./useAsync";

export function useFavorite(slug: string) {
  function favoriteArticle() {
    return ApiClient.POST(`/articles/{slug}/favorite`, {
      params: { path: { slug: slug } },
    }).then(({ data, error }) => {
      if (!data || error) {
        console.error(error);
      } else {
        return data.article;
      }
    });
  }

  function unFavoriteArticle() {
    return ApiClient.DELETE(`/articles/{slug}/favorite`, {
      params: { path: { slug: slug } },
    }).then(({ data, error }) => {
      if (!data || error) {
        console.error(error);
      } else {
        return data.article;
      }
    });
  }

  const { isProcessing: isFavoriteProcessing, startProcess: startFavorite } =
    useAsync(favoriteArticle);
  const { isProcessing: isFavoriteRemoving, startProcess: startUnFavorite } =
    useAsync(unFavoriteArticle);

  return {
    isProcessing: isFavoriteProcessing || isFavoriteRemoving,
    startFavorite,
    startUnFavorite,
  };
}
