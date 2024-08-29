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
    }).then(({ data,response }) => {
      if(response.status!==200)
        throw new Error(response.statusText);
      else if (!data) throw new Error("Login request returned no data");
      return data.user;
    });
  }

  const { isProcessing, startProcess } = useAsync(makeLogInRequest);

  return { loginFormState, isProcessing, startProcess };
}
