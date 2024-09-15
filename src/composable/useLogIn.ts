import { ref } from "vue";
import { ApiClient } from "../api/apiClient";
import { components } from "../api/schema";
import { useAsync } from "./useAsync";

type loginUserType = components["schemas"]["LoginUser"];

export function useLogIn() {
  const loginFormState = ref<loginUserType>({
    email: "",
    password: "",
  });
  function makeLogInRequest() {
    return ApiClient.POST("/users/login", {
      body: {
        user: loginFormState.value,
      },
    }).then(({ data, response }) => {
      if (response.status == 401) {
        throw new Error("Unauthorized access");
      } else if (response.status == 422) {
        throw new Error("Generic Error");
      } else if (!data) throw new Error("Login request returned no data");
      return data.user;
    });
  }

  const { isProcessing, startProcess } = useAsync(makeLogInRequest);

  return { loginFormState, isProcessing, startProcess };
}
