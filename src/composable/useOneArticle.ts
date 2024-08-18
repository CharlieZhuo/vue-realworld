import { ApiClient } from "../api/apiClient";
import { useAsync } from "./useAsync";

export function useOneArticle(slug: string) {
  const getArticle = async () => {
    return ApiClient.GET("/articles/{slug}", {
      params: { path: { slug: slug } },
    }).then(({ data, error }) => {
      if (!data || error) {
        console.log("error", error);
        throw new Error("Error fetching article");
      }
      return data.article;
    });
  };

  const { isProcessing, startProcess } = useAsync(getArticle);

  return { isProcessing, startProcess };
}
