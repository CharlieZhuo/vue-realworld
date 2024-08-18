import { computed } from "vue";
import { ApiClient } from "../api/apiClient";
import { useAsync } from "./useAsync";
export function useFollow(username: string) {
  const followUser = async () => {
    return ApiClient.POST("/profiles/{username}/follow", {
      params: { path: { username: username } },
    }).then(({ data, error }) => {
      if (!data || error) {
        console.log("error", error);
      } else return data.profile;
    });
  };
  const unFollowUser = async () => {
    return ApiClient.DELETE("/profiles/{username}/follow", {
      params: { path: { username: username } },
    }).then(({ data, error }) => {
      if (!data || error) {
        console.log("error", error);
      } else return data.profile;
    });
  };
  const { isProcessing: isf, startProcess: startFollow } = useAsync(followUser);
  const { isProcessing: isuf, startProcess: startUnFollow } =
    useAsync(unFollowUser);

  const isProcessing = computed(() => isf.value || isuf.value);

  return { isProcessing: isProcessing, startFollow, startUnFollow };
}
