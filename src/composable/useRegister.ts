import { ref } from "vue";
import { components } from "../api/schema";
import { ApiClient } from "../api/apiClient";
import { useAsync } from "./useAsync";

type registerUserType = components["schemas"]["NewUser"];

export function useRegister() {
  const registerFormState = ref<registerUserType>({
    email: "",
    password: "",
    username: "",
  });
  const errorMessages = ref<string[]>([]);

  /**
   *
   * @throws {Error}
   * @returns
   */
  function makeRegisterRequest() {
    errorMessages.value = [];
    return ApiClient.POST("/users", {
      body: { user: registerFormState.value },
    }).then(({ data, response }) => {
      if (response.status == 422) {
        throw new Error("Generic Error");
      } else if (!data) throw new Error("Register request returned no data");
      return data.user;
    });
  }
  const { isProcessing, startProcess } = useAsync(makeRegisterRequest);

  return { registerFormState, isProcessing, startProcess };
}
