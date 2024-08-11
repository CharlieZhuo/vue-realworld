import { updateClientToken } from "../api/apiClient";
import { userStore } from "../plugins/user";

export function updateAPIClientFromUserStore() {
  const user = userStore.get();
  if (user) updateClientToken(user.token);
}
