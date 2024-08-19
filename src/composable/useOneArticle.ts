import { ref } from "vue";
import { ApiClient } from "../api/apiClient";
import { components } from "../api/schema";
import { useAsync } from "./useAsync";

export function useOneArticle(slug: string) {
  const article = ref<components["schemas"]["Article"]>();

  const getArticle = async () => {
    return ApiClient.GET("/articles/{slug}", {
      params: { path: { slug: slug } },
    }).then(({ data, error }) => {
      if (!data || error) {
        console.log("error", error);
        throw new Error("Error fetching article");
      }
      article.value = data.article;
      return data.article;
    });
  };

  function changeArticle(newArticle: components["schemas"]["Article"]) {
    article.value = newArticle;
  }

  function changeAuthor(newAuthor: components["schemas"]["Profile"]) {
    if (article.value) {
      article.value.author = newAuthor;
    }
  }

  const { isProcessing, startProcess } = useAsync(getArticle);
  startProcess();

  return { article, changeArticle, changeAuthor, isProcessing, startProcess };
}
