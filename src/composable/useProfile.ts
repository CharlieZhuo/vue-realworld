import { ref } from "vue";
import { ApiClient } from "../api/apiClient";
import { components } from "../api/schema";
import { useAsync } from "./useAsync";
export function useProfile(username: string) {
  const profile = ref<components["schemas"]["Profile"]>();
  function fetchProfile() {
    return ApiClient.GET("/profiles/{username}", {
      params: { path: { username } },
    }).then(({ data }) => {
      if (!data) {
        console.error(`No profile found for ${username}`);
        throw new Error(`No profile found for ${username}`);
      }
      profile.value = data.profile;
      return data.profile;
    });
  }

  const { isProcessing, startProcess } = useAsync(fetchProfile);
  startProcess();

  return { profile, isProcessing };
}
