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
    return ApiClient.POST("/profiles/{username}/follow", {
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

  return { isProcessing: isf || isuf, startFollow, startUnFollow };
}
