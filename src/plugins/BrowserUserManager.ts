import BrowserKVStore from "../stores/BrowserKVStore";
import { UserManager } from "./UserManager";

export const BrowserUserManager = new UserManager(new BrowserKVStore("user"));