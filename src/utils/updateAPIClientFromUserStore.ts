import { reCreateClient } from "../api/apiClient";
import { BrowserUserManager } from "../plugins/BrowserUserManager";


export function updateAPIClientFromUserStore() {
  const user = BrowserUserManager.CurrentUser;
  if (user) reCreateClient(user.token);
}
