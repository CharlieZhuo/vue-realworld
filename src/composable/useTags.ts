import { ref } from "vue";
import { ApiClient } from "../api/apiClient";
import { useAsync } from "./useAsync";

export function useTags() {
  const tags = ref<string[]>([]);
  const fetchTags = () => {
    ApiClient.GET("/tags").then(({ data }) => {
      if (data) {
        tags.value = data.tags;
      }
    });
  };
  const { startProcess, isProcessing } = useAsync({
    process: fetchTags,
  });
  startProcess();
  return {
    tags,
    isProcessing,
  };
}
