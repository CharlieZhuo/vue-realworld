import { updateClientToken } from "../api/apiClient";
import { browserUserStore } from "../plugins/user";

export function updateAPIClientFromUserStore() {
  const user = browserUserStore.get();
  if (user) updateClientToken(user.token);
}
