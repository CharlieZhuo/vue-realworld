import { updateClientToken } from "../api/apiClient";
import { userManager } from "../main";

export function updateAPIClientFromUserStore() {
  const user = userManager.CurrentUser;
  if (user) updateClientToken(user.token);
}
