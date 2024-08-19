import { ref } from "vue";
import { components } from "../api/schema";
import { ApiClient } from "../api/apiClient";
import { useAsync } from "./useAsync";
type Comment = components["schemas"]["Comment"];
export function useComments(articleSlug: string) {
  const comments = ref<Comment[]>([]);

  function fetchComments() {
    return ApiClient.GET("/articles/{slug}/comments", {
      params: { path: { slug: articleSlug } },
    }).then(({ data }) => {
      if (!data) throw new Error("No data");
      comments.value = data.comments;
      return data.comments;
    });
  }

  const { isProcessing: isFetchingComments, startProcess } =
    useAsync(fetchComments);
  startProcess();

  function addCommentLocally(comment: Comment) {
    comments.value.push(comment);
  }
  function removeCommentLocally(commentId: number) {
    const index = comments.value.findIndex((c) => c.id === commentId);
    comments.value.splice(index, 1);
  }

  return {
    comments,
    isFetchingComments,
    addCommentLocally,
    removeCommentLocally,
  };
}
