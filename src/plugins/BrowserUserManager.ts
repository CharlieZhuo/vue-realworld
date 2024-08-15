import BrowserKVStore from "../stores/BrowserKVStore";
import { UserManager } from "./UserManager";
import { components } from "../api/schema";

export const BrowserKVUserStore = new BrowserKVStore<
  components["schemas"]["User"]
>("user");
export const BrowserUserManager = new UserManager(BrowserKVUserStore);
